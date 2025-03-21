export interface IDiscountFilter {
  // 멤버십 카테고리
  carrier: "none" | "skt" | "kt" | "lg"; // 통신사 멤버십 (T멤버십, KT멤버십, U+멤버십)
  useNaverMembership: boolean; // 네이버 멤버십

  // 결제 방법 카테고리
  useNaverPay: boolean; // 네이버페이
  useKakaoPay: boolean; // 카카오페이
  useTossPay: boolean; // 토스페이

  // 카드 결제
  useCardDiscount: boolean; // 카드 할인 사용 여부
  customCardDiscountRate?: number; // 사용자 정의 카드 할인률
}

export const DEFAULT_DISCOUNT_FILTER: IDiscountFilter = {
  carrier: "none",
  useNaverMembership: false,
  useNaverPay: false,
  useKakaoPay: false,
  useTossPay: false,
  useCardDiscount: false,
  customCardDiscountRate: undefined,
};
