import { IDiscountFilter } from "@/types/discountFilter";

/**
 * 현재 한국 시간 기준 요일이 금/토/일인지 확인합니다.
 * @returns 금/토/일이면 true, 아니면 false
 */
function isWeekend(): boolean {
  // 현재 날짜 기준 요일 확인 (로컬 시스템 시간 사용)
  const now = new Date();
  const day = now.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일

  // 금요일(5), 토요일(6), 일요일(0)인 경우 true 반환
  const isWeekendDay = day === 0 || day === 5 || day === 6;
  return isWeekendDay;
}

/**
 * 할인액을 계산합니다.
 * @param amount 총 금액
 * @param discountInfo 할인 정보
 * @returns 할인액
 */
export const calculateDiscount = (
  amount: number,
  discountInfo: {
    discountRate: number;
    maxDiscount?: number;
    minAmount?: number;
  }
): number => {
  // 최소 금액 체크
  if (discountInfo.minAmount && amount < discountInfo.minAmount) {
    return 0;
  }

  // 할인액 계산
  const discountAmount = amount * (discountInfo.discountRate / 100);

  // 1원 미만 할인액은 0원으로 처리
  if (discountAmount < 1) {
    return 0;
  }

  // 최대 할인액 제한
  if (discountInfo.maxDiscount) {
    return Math.min(discountAmount, discountInfo.maxDiscount);
  }

  return discountAmount;
};

/**
 * 중복 할인을 계산합니다.
 * @param amount 총 금액
 * @param firstDiscountInfo 첫 번째 할인 정보 (멤버십)
 * @param secondDiscountInfo 두 번째 할인 정보 (카드)
 * @returns 할인 결과 정보
 */
export const calculateCombinedDiscount = (
  amount: number,
  firstDiscountInfo: {
    discountRate: number;
    maxDiscount?: number;
    minAmount?: number;
  },
  secondDiscountInfo: {
    discountRate: number;
    maxDiscount?: number;
    minAmount?: number;
  }
): {
  totalDiscount: number;
  firstDiscountAmount: number;
  secondDiscountAmount: number;
  remainingAmount: number;
} => {
  // 첫 번째 할인액 계산 (멤버십)
  const firstDiscountAmount = calculateDiscount(amount, firstDiscountInfo);

  // 첫 번째 할인 후 남은 금액
  const remainingAmount = amount - firstDiscountAmount;

  // 두 번째 할인액 계산 (카드)
  const secondDiscountAmount = calculateDiscount(
    remainingAmount,
    secondDiscountInfo
  );

  // 총 할인액
  const totalDiscount = firstDiscountAmount + secondDiscountAmount;

  return {
    totalDiscount,
    firstDiscountAmount,
    secondDiscountAmount,
    remainingAmount,
  };
};

export interface IDiscountCalculationResult {
  method: string; // 결제 방법
  description: string; // 설명
  originalAmount: number; // 원래 금액
  instantDiscountAmount: number; // 즉시 할인 금액 (결제 시점에 차감)
  futureDiscountAmount: number; // 미래 할인 금액 (적립금, 캐시백 등 후속 혜택)
  totalBenefitAmount: number; // 총 혜택 금액 (instantDiscount + futureDiscount)
  finalAmount: number; // 실제 결제 금액 (original - instantDiscount)
  perceivedAmount: number; // 체감가 (original - instantDiscount - futureDiscount)
  discountRate: number; // 총 혜택율 (totalBenefit / original)
  rank: number; // 순위
  note?: string; // 추가 설명
}

// 할인 수단별 최소 결제 금액 정의
const MIN_PURCHASE_AMOUNTS = {
  CARRIER: 1000, // 통신사 멤버십 최소 결제 금액
  NAVER: 0, // 네이버 멤버십 최소 결제 금액 (제한 없음)
  CARD: 0, // 할인 카드 최소 결제 금액 (제한 없음)
};

/**
 * GS25의 할인 정보를 바탕으로 최적 할인을 계산합니다.
 */
export function calculateOptimalDiscounts(
  amount: number,
  filter: IDiscountFilter,
  hasPOPLogo: boolean = false
): IDiscountCalculationResult[] {
  const results: IDiscountCalculationResult[] = [];

  // 현재 주말인지 확인
  const isWeekendNow = isWeekend();

  // 통신사 멤버십 + 네이버페이 주말 캐시백 조합
  if (
    (filter.carrier === "kt" || filter.carrier === "lg") &&
    filter.useNaverPay &&
    isWeekendNow &&
    amount >= MIN_PURCHASE_AMOUNTS.CARRIER
  ) {
    // KT, LG(U+) 멤버십 1,000원당 100원 할인
    const carrierDiscountAmount = Math.floor(amount / 1000) * 100;
    const remainingAmount = amount - carrierDiscountAmount;

    // 네이버페이 캐시백은 2,000원 이상 결제 시 적용
    let cashbackAmount = 0;
    if (remainingAmount >= 2000) {
      cashbackAmount = 500; // 500원 고정 캐시백
    }

    const totalBenefitAmount = carrierDiscountAmount + cashbackAmount;

    results.push({
      method: `${
        filter.carrier === "kt" ? "KT" : "U+"
      } 멤버십 + 네이버페이 주말 캐시백`,
      description: `1,000원당 100원 할인 후 네이버페이로 결제하여 500원 캐시백`,
      originalAmount: amount,
      instantDiscountAmount: carrierDiscountAmount,
      futureDiscountAmount: cashbackAmount,
      totalBenefitAmount: totalBenefitAmount,
      finalAmount: amount - carrierDiscountAmount, // 즉시할인만 차감
      perceivedAmount: amount - totalBenefitAmount, // 즉시할인 + 캐시백 차감
      discountRate: totalBenefitAmount / amount,
      rank: 1,
      note: "통신사 멤버십 적용 후 네이버페이로 결제, 네이버페이 주말 캐시백 사전 신청 필수",
    });
  }

  // 네이버페이 선택 & 주말 & 2,000원 이상인 경우 주말 캐시백 적용
  if (filter.useNaverPay && isWeekendNow && amount >= 2000) {
    const cashbackAmount = 500; // 500원 고정 캐시백

    results.push({
      method: "네이버페이 주말 캐시백",
      description: "2,000원 이상 결제 시 500원 캐시백",
      originalAmount: amount,
      instantDiscountAmount: 0,
      futureDiscountAmount: cashbackAmount,
      totalBenefitAmount: cashbackAmount,
      finalAmount: amount, // 캐시백은 미래 혜택이므로 실제 결제 금액에서 차감되지 않음
      perceivedAmount: amount,
      discountRate: cashbackAmount / amount,
      rank: 1,
      note: "금/토/일 한정, 포인트머니 결제 필요, 하루 1회 (주 최대 3회), 사전 신청 필수",
    });
  }

  // 네이버 멤버십 + 네이버페이 (POP로고 있는 상품만 적용)
  if (filter.useNaverMembership && filter.useNaverPay && hasPOPLogo) {
    const discountRate = 0.1; // 10% 즉시할인
    const pointRate = 0.1; // 10% 포인트적립
    const discountAmount = amount * discountRate; // 즉시할인 금액
    const pointAmount = amount * pointRate; // 포인트적립 금액 (원래 금액 기준)
    const maxPointAmount = Math.min(pointAmount, 5000); // 최대 5,000원 적립 제한

    // 즉시 할인 후 금액 계산
    const amountAfterDiscount = amount - discountAmount;

    // 할인 후 금액이 2,000원 이상이면서 주말인 경우 캐시백 적용
    let cashbackAmount = 0;
    if (isWeekendNow && amountAfterDiscount >= 2000) {
      cashbackAmount = 500; // 주말 캐시백
    }

    const futureDiscountAmount = maxPointAmount + cashbackAmount;
    const totalBenefitAmount = discountAmount + futureDiscountAmount;

    results.push({
      method:
        cashbackAmount > 0
          ? "네이버멤버십 + 네이버페이 + 주말 캐시백"
          : "네이버멤버십 + 네이버페이",
      description:
        cashbackAmount > 0
          ? "10% 즉시할인 + 10% 즉시적립 + 500원 캐시백"
          : "10% 즉시할인 + 10% 즉시적립",
      originalAmount: amount,
      instantDiscountAmount: discountAmount,
      futureDiscountAmount: futureDiscountAmount,
      totalBenefitAmount: totalBenefitAmount,
      finalAmount: amountAfterDiscount, // 즉시할인만 최종금액에서 차감, 캐시백은 미래 혜택
      perceivedAmount: amount - totalBenefitAmount,
      discountRate: totalBenefitAmount / amount,
      rank: 1,
      note:
        cashbackAmount > 0
          ? "POP로고 상품 한정, 적립은 1일 최대 5,000원, 주말 캐시백은 사전 신청 필수"
          : "POP로고 상품 한정, 적립은 1일 최대 5,000원",
    });
  }

  // 통신사 멤버십 KT/LG(U+) + 할인카드 5%
  if (
    (filter.carrier === "kt" || filter.carrier === "lg") &&
    filter.useCardDiscount &&
    filter.customCardDiscountRate &&
    filter.customCardDiscountRate >= 5 &&
    amount >= MIN_PURCHASE_AMOUNTS.CARRIER
  ) {
    // KT, LG(U+) 멤버십 모두 1,000원당 100원 할인
    const carrierDiscountAmount = Math.floor(amount / 1000) * 100; // 1,000원당 100원 할인 (천원 단위 절사)

    const remainingAmount = amount - carrierDiscountAmount;
    const cardDiscountRate = filter.customCardDiscountRate / 100; // 5% 카드 할인
    const cardDiscountAmount = remainingAmount * cardDiscountRate;
    const totalDiscountAmount = carrierDiscountAmount + cardDiscountAmount;

    results.push({
      method: `${filter.carrier === "kt" ? "KT" : "U+"} 멤버십 + ${
        filter.customCardDiscountRate
      }% 할인카드`,
      description: `1,000원당 100원 할인 후 ${filter.customCardDiscountRate}% 추가 할인`,
      originalAmount: amount,
      instantDiscountAmount: carrierDiscountAmount,
      futureDiscountAmount: cardDiscountAmount,
      totalBenefitAmount: totalDiscountAmount,
      finalAmount: amount - totalDiscountAmount,
      perceivedAmount: amount - totalDiscountAmount,
      discountRate: totalDiscountAmount / amount,
      rank: results.length + 1,
      note: "1일 1회 사용 가능, 행사상품/담배/주류 제외",
    });
  }

  // 통신사 멤버십 KT/LG(U+) + 할인카드 2%
  if (
    (filter.carrier === "kt" || filter.carrier === "lg") &&
    filter.useCardDiscount &&
    filter.customCardDiscountRate &&
    filter.customCardDiscountRate < 5 &&
    amount >= MIN_PURCHASE_AMOUNTS.CARRIER
  ) {
    // KT, LG(U+) 멤버십 모두 1,000원당 100원 할인
    const carrierDiscountAmount = Math.floor(amount / 1000) * 100; // 1,000원당 100원 할인 (천원 단위 절사)

    const remainingAmount = amount - carrierDiscountAmount;
    const cardDiscountRate = filter.customCardDiscountRate / 100;
    const cardDiscountAmount = remainingAmount * cardDiscountRate;
    const totalDiscountAmount = carrierDiscountAmount + cardDiscountAmount;

    results.push({
      method: `${filter.carrier === "kt" ? "KT" : "U+"} 멤버십 + ${
        filter.customCardDiscountRate
      }% 할인카드`,
      description: `1,000원당 100원 할인 후 ${filter.customCardDiscountRate}% 추가 할인`,
      originalAmount: amount,
      instantDiscountAmount: carrierDiscountAmount,
      futureDiscountAmount: cardDiscountAmount,
      totalBenefitAmount: totalDiscountAmount,
      finalAmount: amount - totalDiscountAmount,
      perceivedAmount: amount - totalDiscountAmount,
      discountRate: totalDiscountAmount / amount,
      rank: results.length + 1,
      note: "1일 1회 사용 가능, 행사상품/담배/주류 제외",
    });
  }

  // 통신사 멤버십 KT/LG(U+) 단독 사용
  if (
    (filter.carrier === "kt" || filter.carrier === "lg") &&
    amount >= MIN_PURCHASE_AMOUNTS.CARRIER
  ) {
    // KT, LG(U+) 멤버십 모두 1,000원당 100원 할인
    const carrierDiscountAmount = Math.floor(amount / 1000) * 100; // 1,000원당 100원 할인 (천원 단위 절사)

    results.push({
      method: `${filter.carrier === "kt" ? "KT" : "U+"} 멤버십`,
      description: "1,000원당 100원 할인",
      originalAmount: amount,
      instantDiscountAmount: carrierDiscountAmount,
      futureDiscountAmount: 0,
      totalBenefitAmount: carrierDiscountAmount,
      finalAmount: amount - carrierDiscountAmount,
      perceivedAmount: amount - carrierDiscountAmount,
      discountRate: carrierDiscountAmount / amount,
      rank: results.length + 1,
      note: "1일 1회 사용 가능, 행사상품/담배/주류 제외",
    });
  }

  // 할인카드 단독 사용
  if (filter.useCardDiscount && filter.customCardDiscountRate) {
    const cardDiscountRate = filter.customCardDiscountRate / 100;
    const cardDiscountAmount = amount * cardDiscountRate;

    results.push({
      method: `${filter.customCardDiscountRate}% 할인카드`,
      description: `${filter.customCardDiscountRate}% 할인`,
      originalAmount: amount,
      instantDiscountAmount: 0,
      futureDiscountAmount: cardDiscountAmount,
      totalBenefitAmount: cardDiscountAmount,
      finalAmount: amount - cardDiscountAmount,
      perceivedAmount: amount - cardDiscountAmount,
      discountRate: cardDiscountRate,
      rank: results.length + 1,
    });
  }

  // 결과가 없는 경우 (아무 할인도 선택하지 않은 경우)
  if (results.length === 0) {
    results.push({
      method: "할인 없음",
      description: "선택한 할인 수단이 없습니다",
      originalAmount: amount,
      instantDiscountAmount: 0,
      futureDiscountAmount: 0,
      totalBenefitAmount: 0,
      finalAmount: amount,
      perceivedAmount: amount,
      discountRate: 0,
      rank: 1,
    });
  }

  // 할인액 기준으로 내림차순 정렬하고 순위 재할당
  return results
    .sort((a, b) => b.totalBenefitAmount - a.totalBenefitAmount)
    .map((result, index) => ({
      ...result,
      instantDiscountAmount: Math.floor(result.instantDiscountAmount),
      futureDiscountAmount: Math.floor(result.futureDiscountAmount),
      totalBenefitAmount: Math.floor(
        result.instantDiscountAmount + result.futureDiscountAmount
      ),
      finalAmount: amount - Math.floor(result.instantDiscountAmount),
      perceivedAmount:
        amount -
        Math.floor(result.instantDiscountAmount + result.futureDiscountAmount),
      discountRate:
        Math.floor(result.instantDiscountAmount + result.futureDiscountAmount) /
        amount,
      rank: index + 1,
    }));
}
