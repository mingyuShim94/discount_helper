/**
 * discountPresenter.ts
 *
 * 할인 정보를 UI에 표시하기 위한 유틸리티 함수들을 제공합니다.
 * DiscountResult 컴포넌트의 영수증 및 카드 표시 로직을 단순화하고
 * 매장별 할인 정보를 일관되게 관리합니다.
 */

// 할인 유형 정의 (확장 가능한 enum 형태)
export type DiscountType = "instant" | "point" | "cashback";

/**
 * 할인 유형 정보 인터페이스
 */
export interface IDiscountTypeInfo {
  name: string;
  description: string;
  type: DiscountType;
  amount: number;
}

interface IDiscountComponent {
  name: string;
  description: string;
  amount: number;
  color: string;
  type: DiscountType;
}

// 할인 파라미터 인터페이스 (통합)
export interface IDiscountParams {
  naverMembershipInstantAmount?: number;
  naverMembershipPointAmount?: number;
  ktMembershipAmount?: number;
  tMembershipAmount?: number;
  lgMembershipAmount?: number;
  naverPayCashbackAmount?: number;
  kakaoPayAmount?: number;
  discountCardAmount?: number;
  cardPointAmount?: number;
  cardCashbackAmount?: number;
  cardDiscountRate?: number | string;
  cardDiscountType?: string;
  method?: string;
  pointAmount?: number;
  cashbackAmount?: number;
  [key: string]: unknown;
}

// 매장 정보 타입
export interface IStoreConfig {
  id: string;
  name: string;
  discountRates: {
    naverMembershipInstant: number;
    naverMembershipPoint: number;
    tMembership: number | null; // null은 해당 혜택이 없음을 의미
    ktMembership: number | null;
    lgMembership: number | null;
    kakaoPayGoodDeal: number | null;
  };
  descriptions: {
    tMembership: string;
    ktMembership: string;
    lgMembership: string;
    kakaoPayGoodDeal: string;
    naverMembership: string;
    naverPayCashback: string;
  };
  restrictions: {
    naverMembershipProducts: string; // 네이버 멤버십 적용 가능 상품 설명
    tMembershipRestrictions: string;
    ktMembershipRestrictions: string;
    lgMembershipRestrictions: string;
  };
}

// 할인 타입별 스타일 정보
const DISCOUNT_TYPE_STYLES = {
  instant: {
    bg: "bg-green-50",
    border: "border-green-400",
    text: "text-green-700",
    darkText: "text-green-600",
  },
  point: {
    bg: "bg-blue-50",
    border: "border-blue-400",
    text: "text-blue-700",
    darkText: "text-blue-600",
  },
  cashback: {
    bg: "bg-yellow-50",
    border: "border-yellow-400",
    text: "text-yellow-700",
    darkText: "text-yellow-600",
  },
  default: {
    bg: "bg-gray-50",
    border: "border-gray-400",
    text: "text-gray-700",
    darkText: "text-gray-600",
  },
};

// 할인 서비스별 기본 색상
const DISCOUNT_SERVICE_COLORS = {
  naver: "#00C73C", // 네이버 그린
  kakao: "#FFEB00", // 카카오 옐로우
  tworld: "#FF31B0", // T 핑크
  kt: "#FF1C1C", // KT 레드
  lg: "#E6007E", // LG U+ 핑크
  card: "#5A67D8", // 할인카드 색상 (인디고)
};

// 매장 정보 구성 (확장 가능한 맵 형태)
const STORE_CONFIGS: Record<string, IStoreConfig> = {
  "1": {
    id: "1",
    name: "GS25",
    discountRates: {
      naverMembershipInstant: 0.1, // 10%
      naverMembershipPoint: 0.1, // 10%
      tMembership: null, // GS25에서는 T멤버십 혜택이 없음
      ktMembership: 0.1, // 1,000원당 100원 할인 (10%)
      lgMembership: 0.1, // 1,000원당 100원 할인 (10%)
      kakaoPayGoodDeal: 0.03, // 3%
    },
    descriptions: {
      tMembership: "혜택 없음",
      ktMembership: "1,000원당 100원 할인",
      lgMembership: "1,000원당 100원 할인",
      kakaoPayGoodDeal: "카카오페이 굿딜 (3%)",
      naverMembership: "10% 즉시할인 + 10% 즉시적립 (총 20% 혜택)",
      naverPayCashback: "주말/공휴일 2,000원 이상 결제 시 500원 캐시백",
    },
    restrictions: {
      naverMembershipProducts: "가격표에 'POP로고'가 있는 상품만 적용",
      tMembershipRestrictions: "-",
      ktMembershipRestrictions:
        "1일 1회, 행사상품/담배/주류 제외, 1천원 이상 결제 시",
      lgMembershipRestrictions:
        "1일 1회, 행사상품/담배/주류 제외, 1천원 이상 결제 시",
    },
  },
  "2": {
    id: "2",
    name: "CU",
    discountRates: {
      naverMembershipInstant: 0.05, // 5%
      naverMembershipPoint: 0.05, // 5%
      tMembership: 0.1, // 1,000원당 100원 할인 (10%)
      ktMembership: 0.2, // 1,000원당 200원 할인 (20%)
      lgMembership: null, // 혜택 없음
      kakaoPayGoodDeal: null, // 혜택 없음
    },
    descriptions: {
      tMembership: "1,000원당 100원 할인",
      ktMembership: "1,000원당 200원 할인 (오전 5~9시, 간편식만)",
      lgMembership: "혜택 없음",
      kakaoPayGoodDeal: "혜택 없음",
      naverMembership: "5% 즉시할인 + 5% 즉시적립 (총 10% 혜택)",
      naverPayCashback: "주말/공휴일 2,000원 이상 결제 시 500원 캐시백",
    },
    restrictions: {
      naverMembershipProducts: "모든 상품(1+1, 2+1 행사 상품 포함)",
      tMembershipRestrictions: "1일 1회, 행사상품/담배/주류 제외",
      ktMembershipRestrictions:
        "1일 1회, 오전 5~9시, 간편식 상품만 적용, 행사상품/담배/주류 제외",
      lgMembershipRestrictions: "-",
    },
  },
  "3": {
    id: "3",
    name: "세븐일레븐",
    discountRates: {
      naverMembershipInstant: 0, // 혜택 없음
      naverMembershipPoint: 0, // 혜택 없음
      tMembership: 0.1, // 1,000원당 100원 할인 (10%)
      ktMembership: null, // 혜택 없음
      lgMembership: null, // 혜택 없음
      kakaoPayGoodDeal: null, // 혜택 없음
    },
    descriptions: {
      tMembership: "1,000원당 100원 할인",
      ktMembership: "혜택 없음",
      lgMembership: "혜택 없음",
      kakaoPayGoodDeal: "혜택 없음",
      naverMembership: "혜택 없음",
      naverPayCashback: "주말/공휴일 2,000원 이상 결제 시 500원 캐시백",
    },
    restrictions: {
      naverMembershipProducts: "-",
      tMembershipRestrictions: "1일 1회, 행사상품/담배/주류 제외",
      ktMembershipRestrictions: "-",
      lgMembershipRestrictions: "-",
    },
  },
  "4": {
    id: "4",
    name: "이마트24",
    discountRates: {
      naverMembershipInstant: 0, // 혜택 없음
      naverMembershipPoint: 0, // 혜택 없음
      tMembership: null, // 혜택 없음
      ktMembership: 0.1, // 1,000원당 100원 할인 (10%)
      lgMembership: null, // 혜택 없음
      kakaoPayGoodDeal: 0.03, // 3%
    },
    descriptions: {
      tMembership: "혜택 없음",
      ktMembership: "1,000원당 100원 할인",
      lgMembership: "혜택 없음",
      kakaoPayGoodDeal: "카카오페이 굿딜 (3%)",
      naverMembership: "혜택 없음",
      naverPayCashback: "주말/공휴일 2,000원 이상 결제 시 500원 캐시백",
    },
    restrictions: {
      naverMembershipProducts: "-",
      tMembershipRestrictions: "-",
      ktMembershipRestrictions: "1일 1회, 행사상품/담배/주류 제외",
      lgMembershipRestrictions: "-",
    },
  },
  "5": {
    id: "5",
    name: "메가커피",
    discountRates: {
      naverMembershipInstant: 0, // 혜택 없음
      naverMembershipPoint: 0, // 혜택 없음
      tMembership: 0.2, // 20% 할인
      ktMembership: null, // 혜택 없음
      lgMembership: null, // 혜택 없음
      kakaoPayGoodDeal: 0.05, // 5%
    },
    descriptions: {
      tMembership: "T 멤버십 20% 할인",
      ktMembership: "혜택 없음",
      lgMembership: "혜택 없음",
      kakaoPayGoodDeal: "카카오페이 굿딜 (5%)",
      naverMembership: "혜택 없음",
      naverPayCashback: "매일 2,000원 이상 결제 시 500원 캐시백",
    },
    restrictions: {
      naverMembershipProducts: "-",
      tMembershipRestrictions: "1일 1회, 행사 메뉴 제외",
      ktMembershipRestrictions: "-",
      lgMembershipRestrictions: "-",
    },
  },
};

// 기본 매장 설정 (설정이 없는 매장에 사용)
const DEFAULT_STORE_CONFIG: IStoreConfig = {
  id: "0",
  name: "기본 매장",
  discountRates: {
    naverMembershipInstant: 0.05, // 5%
    naverMembershipPoint: 0.05, // 5%
    tMembership: 0.1, // 1,000원당 100원 할인
    ktMembership: 0.1, // 1,000원당 100원 할인
    lgMembership: 0.1, // 1,000원당 100원 할인
    kakaoPayGoodDeal: 0.03, // 3%
  },
  descriptions: {
    tMembership: "1,000원당 100원 할인",
    ktMembership: "1,000원당 100원 할인",
    lgMembership: "1,000원당 100원 할인",
    kakaoPayGoodDeal: "카카오페이 굿딜 (3%)",
    naverMembership: "5% 즉시할인 + 5% 즉시적립 (총 10% 혜택)",
    naverPayCashback: "주말/공휴일 2,000원 이상 결제 시 500원 캐시백",
  },
  restrictions: {
    naverMembershipProducts: "모든 상품",
    tMembershipRestrictions: "1일 1회, 행사상품/담배/주류 제외",
    ktMembershipRestrictions: "1일 1회, 행사상품/담배/주류 제외",
    lgMembershipRestrictions: "1일 1회, 행사상품/담배/주류 제외",
  },
};

/**
 * 매장 ID에 해당하는 매장 설정을 가져옵니다.
 * 설정이 없는 경우 기본 설정을 반환합니다.
 */
export function getStoreConfig(storeId?: string): IStoreConfig {
  if (!storeId || !STORE_CONFIGS[storeId]) {
    return DEFAULT_STORE_CONFIG;
  }
  return STORE_CONFIGS[storeId];
}

/**
 * 할인 방식의 타입에 따른 배경색과 텍스트색을 반환합니다.
 *
 * @param type 할인 타입 (instant, point, cashback)
 * @returns 스타일 클래스 이름 객체
 */
export function getDiscountTypeStyles(type: DiscountType) {
  return DISCOUNT_TYPE_STYLES[type] || DISCOUNT_TYPE_STYLES.default;
}

/**
 * 할인 컴포넌트 분석 유틸리티
 *
 * 할인 정보를 분석하여 즉시할인, 포인트적립, 캐시백 등의 컴포넌트로 분류합니다.
 * 각 할인 유형별로 표시 이름, 설명, 금액, 색상 등의 정보를 제공합니다.
 */
export function getDiscountComponents(
  discount: IDiscountParams,
  storeId?: string
): IDiscountComponent[] {
  const components: IDiscountComponent[] = [];
  const storeConfig = getStoreConfig(storeId);

  // T멤버십 처리
  addTMembershipComponent(components, discount, storeConfig);

  // 네이버 멤버십 처리
  addNaverMembershipComponents(components, discount, storeConfig);

  // KT 멤버십 처리
  addKtMembershipComponent(components, discount, storeConfig);

  // LG U+ 멤버십 처리
  addLgMembershipComponent(components, discount, storeConfig);

  // 네이버페이 캐시백 처리
  addNaverPayCashbackComponent(components, discount, storeConfig);

  // 카카오페이 처리
  addKakaoPayComponent(components, discount, storeConfig);

  // 할인카드 관련 컴포넌트 처리
  addDiscountCardComponents(components, discount);

  return components;
}

// T멤버십 컴포넌트 추가 함수
function addTMembershipComponent(
  components: IDiscountComponent[],
  discount: IDiscountParams,
  storeConfig: IStoreConfig
) {
  // T멤버십 혜택이 없는 매장이면 무시
  if (storeConfig.discountRates.tMembership === null) {
    if (discount.tMembershipAmount && discount.tMembershipAmount > 0) {
      console.warn(`${storeConfig.name}에서는 T멤버십 혜택이 없습니다.`);
    }
    return;
  }

  // T멤버십 할인 추가
  if (discount.tMembershipAmount && discount.tMembershipAmount > 0) {
    components.push({
      name: "T 멤버십 할인",
      description: storeConfig.descriptions.tMembership,
      amount: discount.tMembershipAmount,
      color: DISCOUNT_SERVICE_COLORS.tworld,
      type: "instant",
    });
  }
}

// 네이버 멤버십 컴포넌트 추가 함수
function addNaverMembershipComponents(
  components: IDiscountComponent[],
  discount: IDiscountParams,
  storeConfig: IStoreConfig
) {
  // 네이버 멤버십 - 즉시할인
  if (
    discount.naverMembershipInstantAmount &&
    discount.naverMembershipInstantAmount > 0
  ) {
    const rate = storeConfig.discountRates.naverMembershipInstant * 100;
    components.push({
      name: "네이버멤버십 즉시할인",
      description: `네이버멤버십 즉시할인 (${rate}%)`,
      amount: discount.naverMembershipInstantAmount,
      color: DISCOUNT_SERVICE_COLORS.naver,
      type: "instant",
    });
  }

  // 네이버 멤버십 - 포인트
  if (
    discount.naverMembershipPointAmount &&
    discount.naverMembershipPointAmount > 0
  ) {
    const rate = storeConfig.discountRates.naverMembershipPoint * 100;
    components.push({
      name: "네이버멤버십 포인트",
      description: `네이버멤버십 포인트 (${rate}%)`,
      amount: discount.naverMembershipPointAmount,
      color: DISCOUNT_SERVICE_COLORS.naver,
      type: "point",
    });
  }
}

// KT 멤버십 컴포넌트 추가 함수
function addKtMembershipComponent(
  components: IDiscountComponent[],
  discount: IDiscountParams,
  storeConfig: IStoreConfig
) {
  // KT멤버십 혜택이 없는 매장이면 무시
  if (storeConfig.discountRates.ktMembership === null) {
    if (discount.ktMembershipAmount && discount.ktMembershipAmount > 0) {
      console.warn(`${storeConfig.name}에서는 KT멤버십 혜택이 없습니다.`);
    }
    return;
  }

  if (discount.ktMembershipAmount && discount.ktMembershipAmount > 0) {
    components.push({
      name: "KT 멤버십 할인",
      description: storeConfig.descriptions.ktMembership,
      amount: discount.ktMembershipAmount,
      color: DISCOUNT_SERVICE_COLORS.kt,
      type: "instant",
    });
  }
}

// LG U+ 멤버십 컴포넌트 추가 함수
function addLgMembershipComponent(
  components: IDiscountComponent[],
  discount: IDiscountParams,
  storeConfig: IStoreConfig
) {
  // LG U+ 멤버십 혜택이 없는 매장이면 무시
  if (storeConfig.discountRates.lgMembership === null) {
    if (discount.lgMembershipAmount && discount.lgMembershipAmount > 0) {
      console.warn(`${storeConfig.name}에서는 LG U+ 멤버십 혜택이 없습니다.`);
    }
    return;
  }

  if (discount.lgMembershipAmount && discount.lgMembershipAmount > 0) {
    components.push({
      name: "LG U+ 멤버십 할인",
      description: storeConfig.descriptions.lgMembership,
      amount: discount.lgMembershipAmount,
      color: DISCOUNT_SERVICE_COLORS.lg,
      type: "instant",
    });
  }
}

// 네이버페이 캐시백 컴포넌트 추가 함수
function addNaverPayCashbackComponent(
  components: IDiscountComponent[],
  discount: IDiscountParams,
  storeConfig: IStoreConfig
) {
  if (discount.naverPayCashbackAmount && discount.naverPayCashbackAmount > 0) {
    components.push({
      name: "네이버페이 캐시백",
      description: storeConfig.descriptions.naverPayCashback,
      amount: discount.naverPayCashbackAmount,
      color: DISCOUNT_SERVICE_COLORS.naver,
      type: "cashback",
    });
  }
}

// 카카오페이 컴포넌트 추가 함수
function addKakaoPayComponent(
  components: IDiscountComponent[],
  discount: IDiscountParams,
  storeConfig: IStoreConfig
) {
  // 카카오페이 혜택이 없는 매장이면 무시
  if (storeConfig.discountRates.kakaoPayGoodDeal === null) {
    if (discount.kakaoPayAmount && discount.kakaoPayAmount > 0) {
      console.warn(
        `${storeConfig.name}에서는 카카오페이 할인 혜택이 없습니다.`
      );
    }
    return;
  }

  if (discount.kakaoPayAmount && discount.kakaoPayAmount > 0) {
    components.push({
      name: "카카오페이 할인",
      description: storeConfig.descriptions.kakaoPayGoodDeal,
      amount: discount.kakaoPayAmount,
      color: DISCOUNT_SERVICE_COLORS.kakao,
      type: "instant",
    });
  }
}

// 할인카드 관련 컴포넌트 추가 함수
function addDiscountCardComponents(
  components: IDiscountComponent[],
  discount: IDiscountParams
) {
  // 할인 카드 비율 추출 함수
  const getCardDiscountRate = () => {
    if (typeof discount.cardDiscountRate === "number") {
      return discount.cardDiscountRate.toString();
    }
    return /(\d+)%/.exec(String(discount.cardDiscountRate || ""))?.[1] || "5";
  };

  // 할인 유형 결정 함수
  const determineDiscountType = (): DiscountType => {
    const cardDiscountType = String(discount.cardDiscountType || "instant");
    const method = typeof discount.method === "string" ? discount.method : "";

    if (!["instant", "point", "cashback"].includes(cardDiscountType)) {
      if (
        typeof discount.pointAmount === "number" &&
        discount.pointAmount > 0 &&
        method.includes("할인카드")
      ) {
        return "point";
      } else if (
        typeof discount.cashbackAmount === "number" &&
        discount.cashbackAmount > 0 &&
        method.includes("할인카드")
      ) {
        return "cashback";
      }
      return "instant";
    }

    return cardDiscountType as DiscountType;
  };

  // 할인카드 즉시할인 컴포넌트 추가
  if (discount.discountCardAmount && discount.discountCardAmount > 0) {
    const cardDiscountRate = getCardDiscountRate();
    const discountType = determineDiscountType();

    // 할인 유형에 따른 텍스트 설정
    const typeTextMap: Record<DiscountType, string> = {
      instant: "즉시할인",
      point: "적립",
      cashback: "캐시백",
    };

    // 즉시 할인 유형인 경우만 discountCardAmount 사용
    if (discountType === "instant") {
      components.push({
        name: "할인카드 할인",
        description: `${cardDiscountRate}% ${typeTextMap[discountType]}`,
        amount: discount.discountCardAmount,
        color: DISCOUNT_SERVICE_COLORS.card,
        type: discountType,
      });
    }
  }

  // 할인카드 적립 컴포넌트 추가
  if (discount.cardPointAmount && discount.cardPointAmount > 0) {
    const cardDiscountRate = getCardDiscountRate();
    components.push({
      name: "할인카드 적립",
      description: `${cardDiscountRate}% 적립`,
      amount: discount.cardPointAmount,
      color: DISCOUNT_SERVICE_COLORS.card,
      type: "point",
    });
  }

  // 할인카드 캐시백 컴포넌트 추가
  if (discount.cardCashbackAmount && discount.cardCashbackAmount > 0) {
    const cardDiscountRate = getCardDiscountRate();
    components.push({
      name: "할인카드 캐시백",
      description: `${cardDiscountRate}% 캐시백`,
      amount: discount.cardCashbackAmount,
      color: DISCOUNT_SERVICE_COLORS.card,
      type: "cashback",
    });
  }
}

/**
 * 할인 방식의 이름을 사용자 친화적으로 변환합니다.
 *
 * @param method 할인 방식 (예: "네이버멤버십 + 네이버페이")
 * @returns 사용자 친화적인 이름
 */
export function getFriendlyMethodName(method: string): string {
  if (!method) return "";

  const friendlyNameMap: Record<string, string> = {
    "네이버멤버십 + 네이버페이": "네이버 멤버십 혜택",
    "네이버멤버십 + 네이버페이 + 주말 캐시백": "네이버 종합 혜택 (주말)",
    "카카오페이 굿딜": "카카오페이 할인",
    "T 멤버십": "SKT 멤버십",
    "KT 멤버십": "KT 통신사 할인",
    "U+ 멤버십": "LG U+ 통신사 할인",
  };

  let result = method;

  // 각 패턴을 찾아 변환
  Object.entries(friendlyNameMap).forEach(([pattern, replacement]) => {
    result = result.replace(pattern, replacement);
  });

  return result;
}

/**
 * 할인 방식에 따른 아이콘 이름을 반환합니다.
 * Lucide React 아이콘을 기준으로 합니다.
 *
 * @param method 할인 방식
 * @returns 아이콘 이름
 */
export function getDiscountMethodIcon(method: string): string {
  const discountIconMap: Record<string, string> = {
    네이버: "Compass",
    카카오페이: "MessageSquare",
    "T 멤버십": "Radio",
    KT: "Smartphone",
    "U+": "Wifi",
    할인카드: "CreditCard",
  };

  // 각 키워드에 대해 검사하고 일치하는 아이콘 반환
  for (const [keyword, icon] of Object.entries(discountIconMap)) {
    if (method.includes(keyword)) {
      return icon;
    }
  }

  // 기본 아이콘
  return "BadgePercent";
}
