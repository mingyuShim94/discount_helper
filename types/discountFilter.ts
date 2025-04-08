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
  cardDiscountType: "instant" | "point" | "cashback"; // 카드 할인 타입 - 즉시할인/적립/캐시백

  // 매장별 특성
  storeSpecificOptions?: IStoreSpecificOptions;
}

// 매장별 특성 인터페이스
export interface IStoreSpecificOptions {
  // GS25 관련 옵션
  gs25?: {
    isPOPLogo: boolean; // POP 로고 유무 (GS25에서만 사용)
  };
  // CU 관련 옵션 (storeId: "2")
  "2"?: {
    isConvenienceFood: boolean; // 간편식 상품 여부 (CU의 KT 멤버십 할인에 필요)
  };
  // 향후 다른 매장별 특성 추가 가능
  cu?: Record<string, unknown>; // 레거시 속성, 삭제 예정
  sevenEleven?: Record<string, unknown>;
  emart24?: Record<string, unknown>;
}

export const DEFAULT_DISCOUNT_FILTER: IDiscountFilter = {
  carrier: "none",
  useNaverMembership: false,
  useNaverPay: false,
  useKakaoPay: false,
  useTossPay: false,
  useCardDiscount: false,
  customCardDiscountRate: undefined,
  cardDiscountType: "instant", // 기본값은 즉시할인으로 설정
  storeSpecificOptions: {
    gs25: {
      isPOPLogo: false,
    },
    "2": {
      isConvenienceFood: false,
    },
  },
};

// 할인 필터 및 계산 관련 추가 타입
export interface IAmountSettings {
  amount: number; // 입력된 금액
}

export interface IDiscountPreferences {
  prioritizeInstantDiscount: boolean; // 즉시할인 우선 여부
  prioritizePoint: boolean; // 적립 우선 여부
  prioritizeCashback: boolean; // 캐시백 우선 여부
  showDetailedCalculation: boolean; // 상세 계산 표시 여부
}

export const DEFAULT_AMOUNT_SETTINGS: IAmountSettings = {
  amount: 5000,
};

export const DEFAULT_DISCOUNT_PREFERENCES: IDiscountPreferences = {
  prioritizeInstantDiscount: true,
  prioritizePoint: false,
  prioritizeCashback: false,
  showDetailedCalculation: false,
};
