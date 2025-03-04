import { IDiscountInfo, DiscountType } from "@/types/discount";

interface OptimizedDiscount {
  totalDiscountRate: number;
  combinations: IDiscountInfo[];
  description: string;
}

export function optimizeDiscounts(
  discounts: IDiscountInfo[],
  currentTime = new Date()
): OptimizedDiscount {
  const day = currentTime.getDay(); // 0: 일요일, 1: 월요일, ...
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes();
  const currentTimeStr = `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;

  // 1. 시간대별 적용 가능한 할인 필터링
  const availableDiscounts = discounts.filter((discount) => {
    if (discount.validTime) {
      const [start, end] = discount.validTime.split("~");
      return isTimeBetween(currentTimeStr, start, end);
    }
    return true;
  });

  // 2. 요일별 적용 가능한 할인 필터링
  const dayMap = ["일", "월", "화", "수", "목", "금", "토"];
  const todayDiscounts = availableDiscounts.filter((discount) => {
    if (!discount.validDays) return true;
    return discount.validDays.includes(dayMap[day]);
  });

  // 3. 멤버십 할인과 결제 할인 분리
  const membershipDiscounts = todayDiscounts.filter(
    (d) =>
      d.type === DiscountType.MEMBERSHIP ||
      d.type === DiscountType.NAVERMEMBERSHIP
  );
  const paymentDiscounts = todayDiscounts.filter(
    (d) => d.type === DiscountType.NAVERPAY || d.type === DiscountType.SPECIAL
  );

  // 4. 최적의 멤버십 할인 선택
  const bestMembership = membershipDiscounts.reduce((best, current) => {
    const currentRate = getEffectiveDiscountRate(current);
    const bestRate = getEffectiveDiscountRate(best);
    return currentRate > bestRate ? current : best;
  }, membershipDiscounts[0]);

  // 5. 최적의 결제 할인 선택
  const bestPayment = paymentDiscounts.reduce((best, current) => {
    const currentRate = getEffectiveDiscountRate(current);
    const bestRate = getEffectiveDiscountRate(best);
    return currentRate > bestRate ? current : best;
  }, paymentDiscounts[0]);

  // 6. 최종 할인 조합 생성
  const combinations: IDiscountInfo[] = [];
  let totalDiscountRate = 0;
  const descriptionParts: string[] = [];

  if (bestMembership) {
    combinations.push(bestMembership);
    totalDiscountRate += getEffectiveDiscountRate(bestMembership);
    descriptionParts.push(
      `${bestMembership.title} ${bestMembership.description}`
    );
  }

  if (bestPayment) {
    combinations.push(bestPayment);
    totalDiscountRate += getEffectiveDiscountRate(bestPayment);
    descriptionParts.push(`${bestPayment.title} ${bestPayment.description}`);
  }

  return {
    totalDiscountRate,
    combinations,
    description: descriptionParts.join(" + "),
  };
}

function isTimeBetween(current: string, start: string, end: string): boolean {
  const [currentHour, currentMinute] = current.split(":").map(Number);
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  const currentMinutes = currentHour * 60 + currentMinute;
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

function getEffectiveDiscountRate(discount: IDiscountInfo): number {
  if (!discount) return 0;

  if (discount.discountRate) {
    return discount.discountRate;
  }

  // 1000원당 100원 할인 = 10% 할인으로 변환
  if (discount.description.includes("1,000원당")) {
    const match = discount.description.match(/(\d+)원 할인/);
    if (match) {
      return Number(match[1]) / 10;
    }
  }

  return 0;
}
