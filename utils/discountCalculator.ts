import { IDiscountFilter } from "@/types/discountFilter";

export interface IDiscountCalculationResult {
  method: string;
  description: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  discountRate: number;
  rank: number;
  note?: string;
}

// 할인 수단별 최소 결제 금액 정의
const MIN_PURCHASE_AMOUNTS = {
  CARRIER: 1000, // 통신사 멤버십 최소 결제 금액
  NAVER: 0, // 네이버 멤버십 최소 결제 금액 (제한 없음)
  CARD: 0, // 할인 카드 최소 결제 금액 (제한 없음)
};

// 할인 구간 정보를 위한 인터페이스
export interface IDiscountBreakpoint {
  startAmount: number; // 구간 시작 금액
  endAmount?: number; // 구간 종료 금액 (없으면 무한대)
  optimalMethod: string; // 최적 할인 방법
  description: string; // 설명
  discountRate?: number; // 할인율 (%)
  discountAmount?: number; // 할인 금액
}

/**
 * GS25의 할인 정보를 바탕으로 최적 할인을 계산합니다.
 */
export function calculateOptimalDiscounts(
  amount: number,
  filter: IDiscountFilter,
  hasPOPLogo: boolean = false
): IDiscountCalculationResult[] {
  const results: IDiscountCalculationResult[] = [];

  // 네이버 멤버십 + 네이버페이 (POP로고 있는 상품만 적용)
  if (filter.useNaverMembership && filter.useNaverPay && hasPOPLogo) {
    const discountRate = 0.1; // 10% 즉시할인
    const pointRate = 0.1; // 10% 포인트적립
    const discountAmount = amount * discountRate; // 즉시할인 금액
    const pointAmount = amount * pointRate; // 포인트적립 금액 (원래 금액 기준)
    const maxPointAmount = Math.min(pointAmount, 5000); // 최대 5,000원 적립 제한

    results.push({
      method: "네이버멤버십 + 네이버페이",
      description: "10% 즉시할인 + 10% 즉시적립",
      originalAmount: amount,
      discountAmount: discountAmount + maxPointAmount, // 할인 + 적립 합산
      finalAmount: amount - discountAmount,
      discountRate: (discountAmount + maxPointAmount) / amount, // 총 할인율 (20% 또는 적립 제한 금액)
      rank: 1,
      note: "POP로고 상품 한정, 적립은 1일 최대 5,000원",
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
      discountAmount: totalDiscountAmount,
      finalAmount: amount - totalDiscountAmount,
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
      discountAmount: totalDiscountAmount,
      finalAmount: amount - totalDiscountAmount,
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
      discountAmount: carrierDiscountAmount,
      finalAmount: amount - carrierDiscountAmount,
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
      discountAmount: cardDiscountAmount,
      finalAmount: amount - cardDiscountAmount,
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
      discountAmount: 0,
      finalAmount: amount,
      discountRate: 0,
      rank: 1,
    });
  }

  // 할인액 기준으로 내림차순 정렬하고 순위 재할당
  return results
    .sort((a, b) => b.discountAmount - a.discountAmount)
    .map((result, index) => ({
      ...result,
      rank: index + 1,
    }));
}

/**
 * 최적 할인 방법이 바뀌는 금액 구간을 찾습니다.
 * @param filter 할인 필터
 * @param hasPOPLogo POP로고 유무
 */
export function getBestDiscountBreakpoints(
  filter: IDiscountFilter,
  hasPOPLogo: boolean = false
): { amount: number; optimalMethod: string; description: string }[] {
  const breakpoints = [];

  // 통신사 멤버십만 선택한 경우
  if (
    (filter.carrier === "kt" || filter.carrier === "lg") &&
    !filter.useNaverMembership &&
    !filter.useCardDiscount
  ) {
    // 1,000원 미만 구간 - 할인 없음
    breakpoints.push({
      amount: 1,
      optimalMethod: "할인 없음",
      description: "~1,000원 미만 - 최적할인 없음",
    });

    // 1,000원 이상 구간 - 통신사 멤버십
    breakpoints.push({
      amount: 1000,
      optimalMethod: `${filter.carrier === "kt" ? "KT" : "U+"} 멤버십`,
      description: "1,000원 이상 - 1,000원당 100원 할인",
    });

    return breakpoints;
  }

  // 네이버 멤버십 + 네이버페이만 선택한 경우 (POP 로고 있음)
  if (
    filter.useNaverMembership &&
    filter.useNaverPay &&
    hasPOPLogo &&
    !filter.carrier &&
    !filter.useCardDiscount
  ) {
    breakpoints.push({
      amount: 1,
      optimalMethod: "네이버멤버십 + 네이버페이",
      description: "모든 금액 - 20.0% 혜택 (10% 즉시할인 + 10% 적립)",
    });

    return breakpoints;
  }

  // 할인카드만 선택한 경우
  if (
    !filter.carrier &&
    !filter.useNaverMembership &&
    filter.useCardDiscount &&
    filter.customCardDiscountRate
  ) {
    breakpoints.push({
      amount: 1,
      optimalMethod: `${filter.customCardDiscountRate}% 할인카드`,
      description: `모든 금액 - ${filter.customCardDiscountRate}% 할인`,
    });

    return breakpoints;
  }

  // 아무 할인도 선택하지 않은 경우
  if (
    !filter.carrier &&
    !filter.useNaverMembership &&
    !filter.useCardDiscount
  ) {
    breakpoints.push({
      amount: 1,
      optimalMethod: "할인 없음",
      description: "모든 금액 - 할인 없음",
    });

    return breakpoints;
  }

  // 복합 선택 케이스 (여러 할인 수단 선택)
  const testAmounts = [
    1, 500, 999, 1000, 2000, 3000, 5000, 10000, 20000, 30000, 50000,
  ];

  // 금액별 최적 할인 방법 계산
  const amountResults = testAmounts.map((amount) => {
    const results = calculateOptimalDiscounts(amount, filter, hasPOPLogo);
    return {
      amount,
      bestMethod: results.length > 0 ? results[0].method : "할인 없음",
      discountAmount: results.length > 0 ? results[0].discountAmount : 0,
      finalAmount: results.length > 0 ? results[0].finalAmount : amount,
      discountRate: results.length > 0 ? results[0].discountRate : 0,
    };
  });

  // 변화 지점 찾기
  let currentBestMethod = null;

  for (let i = 0; i < amountResults.length; i++) {
    const result = amountResults[i];

    // 처음이거나 최적 할인 방법이 변경되었을 때
    if (currentBestMethod !== result.bestMethod) {
      currentBestMethod = result.bestMethod;

      // 안전한 문자열 변환을 위한 null 체크
      const formattedAmount = result.amount.toLocaleString();
      const formattedRate = (result.discountRate * 100).toFixed(1);
      const formattedDiscount = result.discountAmount.toLocaleString();

      // 설명 구성
      let description = "";

      // 1,000원 기준점에서 통신사 멤버십
      if (
        result.amount === 1000 &&
        (result.bestMethod.includes("KT 멤버십") ||
          result.bestMethod.includes("U+ 멤버십"))
      ) {
        description = "1,000원 이상 - 1,000원당 100원 할인";
      }
      // 1원에서 시작하는 할인 없음
      else if (result.amount === 1 && result.bestMethod === "할인 없음") {
        description = "~1,000원 미만 - 최적할인 없음";
      }
      // 일반적인 경우
      else {
        description = `${formattedAmount}원부터 - ${formattedRate}% 할인 (${formattedDiscount}원)`;
      }

      breakpoints.push({
        amount: result.amount,
        optimalMethod: result.bestMethod,
        description: description,
      });
    }
  }

  // 결과가 없는 경우
  if (breakpoints.length === 0) {
    breakpoints.push({
      amount: 1,
      optimalMethod: "할인 없음",
      description: "모든 금액 - 할인 없음",
    });
  }

  return breakpoints;
}

/**
 * 할인 방법이 변경되는 정확한 금액을 찾습니다. (이진 탐색 이용)
 * 이 함수는 일단 사용하지 않을 것이므로 주석 처리하거나 삭제
 */
// function findExactBreakpoint(
//   lowerBound: number,
//   upperBound: number,
//   filter: IDiscountFilter,
//   hasPOPLogo: boolean,
//   targetMethod: string
// ): number {
//   // 가장 간단한 방법으로 변경
//   return upperBound;
// }
