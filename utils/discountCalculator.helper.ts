/**
 * discountCalculator.helper.ts
 *
 * 할인 계산을 위한 헬퍼 함수들을 제공합니다.
 * DiscountDetail 컴포넌트에서 추출한 계산 로직을 모듈화했습니다.
 */

import { IDiscountCalculationResult } from "./discountCalculator";

// 멤버십 유형 키워드를 위한 상수
const MEMBERSHIP_KEYWORDS = {
  MEMBERSHIP: "멤버십",
  NAVER_MEMBERSHIP: "네이버멤버십",
  NAVER_PAY: "네이버페이",
  KAKAOPAY: "카카오페이",
  TOSSPAY: "토스페이",
  DISCOUNT_CARD: "할인카드",
};

// 매장별 네이버 멤버십 할인율
const NAVER_MEMBERSHIP_RATES: Record<string, number> = {
  gs25: 0.1, // 10%
  default: 0.05, // 5%
};

/**
 * 단일 할인인지 확인하는 함수
 *
 * @param method 할인 방법
 * @returns 단일 할인 여부
 */
function isSingleDiscount(method: string): boolean {
  const lowerMethod = method.toLowerCase();

  // 단일 멤버십 할인
  if (
    lowerMethod.includes(MEMBERSHIP_KEYWORDS.MEMBERSHIP) &&
    !lowerMethod.includes(MEMBERSHIP_KEYWORDS.KAKAOPAY) &&
    !lowerMethod.includes(MEMBERSHIP_KEYWORDS.TOSSPAY) &&
    !lowerMethod.includes(MEMBERSHIP_KEYWORDS.DISCOUNT_CARD) &&
    !(
      lowerMethod.includes(MEMBERSHIP_KEYWORDS.NAVER_MEMBERSHIP) &&
      lowerMethod.includes(MEMBERSHIP_KEYWORDS.NAVER_PAY)
    )
  ) {
    return true;
  }

  // 단일 결제수단 할인
  if (
    (lowerMethod.includes(MEMBERSHIP_KEYWORDS.KAKAOPAY) &&
      !lowerMethod.includes(MEMBERSHIP_KEYWORDS.MEMBERSHIP)) ||
    (lowerMethod.includes(MEMBERSHIP_KEYWORDS.TOSSPAY) &&
      !lowerMethod.includes(MEMBERSHIP_KEYWORDS.MEMBERSHIP)) ||
    (lowerMethod.includes(MEMBERSHIP_KEYWORDS.DISCOUNT_CARD) &&
      !lowerMethod.includes(MEMBERSHIP_KEYWORDS.MEMBERSHIP)) ||
    (lowerMethod.includes(MEMBERSHIP_KEYWORDS.NAVER_PAY) &&
      !lowerMethod.includes(MEMBERSHIP_KEYWORDS.NAVER_MEMBERSHIP))
  ) {
    return true;
  }

  return false;
}

/**
 * 복합 할인에서 각 항목별 할인 금액을 계산하는 함수
 *
 * @param discount 할인 결과 객체
 * @param methodKeyword 할인 방법 키워드 (예: "T 멤버십", "카카오페이")
 * @param totalInstantDiscount 총 즉시 할인 금액
 * @returns 해당 항목의 할인 금액
 */
export function calculateDiscountItemAmount(
  discount: IDiscountCalculationResult,
  methodKeyword: string,
  totalInstantDiscount: number
): number {
  const method = discount.method.toLowerCase();
  const keyword = methodKeyword.toLowerCase();

  // 단일 할인인 경우 전체 할인 금액 반환 (성능 최적화: 가장 많은 케이스를 먼저 체크)
  if (isSingleDiscount(method)) {
    return totalInstantDiscount;
  }

  // 네이버멤버십 + 네이버페이 특별 케이스
  if (
    method.includes(MEMBERSHIP_KEYWORDS.NAVER_MEMBERSHIP.toLowerCase()) &&
    method.includes(MEMBERSHIP_KEYWORDS.NAVER_PAY.toLowerCase())
  ) {
    if (keyword.includes(MEMBERSHIP_KEYWORDS.NAVER_MEMBERSHIP.toLowerCase())) {
      // 매장별 할인율 확인 (gs25는 10%, 기본 5%)
      const rate = method.includes("gs25")
        ? NAVER_MEMBERSHIP_RATES.gs25
        : NAVER_MEMBERSHIP_RATES.default;

      return Math.floor(discount.originalAmount * rate);
    } else if (keyword.includes(MEMBERSHIP_KEYWORDS.NAVER_PAY.toLowerCase())) {
      // 네이버페이는 캐시백 위주므로 즉시 할인은 없음
      return 0;
    }
  }

  // 통신사 멤버십(T/KT/U+) + 결제수단(카카오페이/토스페이) 조합
  if (
    method.includes(MEMBERSHIP_KEYWORDS.MEMBERSHIP.toLowerCase()) &&
    (method.includes(MEMBERSHIP_KEYWORDS.KAKAOPAY.toLowerCase()) ||
      method.includes(MEMBERSHIP_KEYWORDS.TOSSPAY.toLowerCase()) ||
      method.includes(MEMBERSHIP_KEYWORDS.NAVER_PAY.toLowerCase()))
  ) {
    // 멤버십 항목인 경우
    if (keyword.includes(MEMBERSHIP_KEYWORDS.MEMBERSHIP.toLowerCase())) {
      // 통신사 멤버십은 원래 금액의 약 10% (1000원당 100원)
      return Math.floor(discount.originalAmount / 1000) * 100;
    }
    // 결제 수단인 경우
    else {
      // 멤버십 할인 금액 계산
      const membershipDiscount =
        Math.floor(discount.originalAmount / 1000) * 100;
      // 결제수단의 할인 금액 = 전체 할인 - 멤버십 할인
      return totalInstantDiscount - membershipDiscount;
    }
  }

  // 멤버십 + 할인카드 조합
  if (
    method.includes(MEMBERSHIP_KEYWORDS.MEMBERSHIP.toLowerCase()) &&
    method.includes(MEMBERSHIP_KEYWORDS.DISCOUNT_CARD.toLowerCase())
  ) {
    // 멤버십 항목인 경우
    if (keyword.includes(MEMBERSHIP_KEYWORDS.MEMBERSHIP.toLowerCase())) {
      return Math.floor(discount.originalAmount / 1000) * 100;
    }
    // 할인카드 항목인 경우
    else if (
      keyword.includes(MEMBERSHIP_KEYWORDS.DISCOUNT_CARD.toLowerCase())
    ) {
      const membershipDiscount =
        Math.floor(discount.originalAmount / 1000) * 100;
      return totalInstantDiscount - membershipDiscount;
    }
  }

  // 기본값으로 전체 할인 금액 반환 (더 나은 추정이 없는 경우)
  return totalInstantDiscount;
}
