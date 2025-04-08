// 사용하지 않는 import 제거
// import { IStore } from "@/types/store";

// 할인 정책 인터페이스
export interface IDiscountRule {
  storeId: string;

  // 통신사 멤버십 할인
  carrierMembership: {
    skt: {
      enabled: boolean;
      discountRate: number; // 1,000원당 할인율 (100원 = 0.1)
      restrictions?: string[];
      excludedProducts?: string[];
      timeRestriction?: {
        startHour: number;
        endHour: number;
      };
      productRestriction?: string; // 예: "간편식"
    };
    kt: {
      enabled: boolean;
      discountRate: number;
      restrictions?: string[];
      excludedProducts?: string[];
      timeRestriction?: {
        startHour: number;
        endHour: number;
      };
      productRestriction?: string;
    };
    lg: {
      enabled: boolean;
      discountRate: number;
      restrictions?: string[];
      excludedProducts?: string[];
      timeRestriction?: {
        startHour: number;
        endHour: number;
      };
      productRestriction?: string;
    };
  };

  // 네이버 멤버십 할인
  naverMembership: {
    enabled: boolean;
    instantDiscountRate: number; // 즉시 할인율 (5% = 0.05)
    pointRate: number; // 포인트 적립율 (5% = 0.05)
    maxPointAmount: number; // 최대 적립 한도
    productRestriction: "all" | "popLogo"; // 모든 상품 적용 or POP 로고 상품만
    restrictions?: string[];
  };

  // 네이버페이 주말 캐시백
  naverPayWeekend: {
    enabled: boolean;
    minAmount: number; // 최소 결제 금액
    cashbackAmount: number; // 캐시백 금액
  };

  // 카카오페이 굿딜
  kakaoPay?: {
    enabled: boolean;
    discountRate: number; // 할인율 (3% = 0.03)
    restrictions?: string[];
  };

  // 기타 매장별 특별 할인
  specialDiscounts?: Array<{
    name: string;
    description: string;
    discountRate?: number;
    discountAmount?: number;
    minAmount?: number;
    maxDiscountAmount?: number;
    conditions?: string[];
  }>;
}

// 매장별 할인 정책
export const DISCOUNT_RULES: IDiscountRule[] = [
  {
    storeId: "1", // GS25
    carrierMembership: {
      skt: {
        enabled: false, // T멤버십 혜택 없음
        discountRate: 0,
      },
      kt: {
        enabled: true,
        discountRate: 0.1, // 1,000원당 100원
        restrictions: ["1일 1회", "1천 원 이상 결제 시 적용"],
        excludedProducts: ["행사 상품", "담배", "주류", "종량제 봉투"],
      },
      lg: {
        enabled: true,
        discountRate: 0.1, // 1,000원당 100원
        restrictions: ["1일 1회", "1천 원 이상 결제 시 적용"],
        excludedProducts: ["행사 상품", "담배", "주류", "종량제 봉투"],
      },
    },
    naverMembership: {
      enabled: true,
      instantDiscountRate: 0.1, // 10% 즉시 할인
      pointRate: 0.1, // 10% 포인트 적립
      maxPointAmount: 5000, // 최대 5,000원 적립
      productRestriction: "popLogo", // POP로고 상품만 적용
      restrictions: ["1일 1회 최대 5,000원 적립", "복합결제 불가"],
    },
    naverPayWeekend: {
      enabled: true,
      minAmount: 2000,
      cashbackAmount: 500,
    },
    kakaoPay: {
      enabled: true,
      discountRate: 0.03, // 3% 할인
      restrictions: ["카카오페이 굿딜로 결제 시 적용"],
    },
  },
  {
    storeId: "2", // CU
    carrierMembership: {
      skt: {
        enabled: true,
        discountRate: 0.1, // 1,000원당 100원
        restrictions: ["1일 1회"],
        excludedProducts: ["행사 상품", "담배", "주류", "종량제 봉투"],
      },
      kt: {
        enabled: true,
        discountRate: 0.2, // 1,000원당 200원
        timeRestriction: {
          startHour: 5,
          endHour: 9,
        },
        productRestriction: "간편식",
        restrictions: ["1일 1회", "오전 5~9시에만 적용", "간편식 상품만 해당"],
        excludedProducts: ["행사 상품", "담배", "주류", "종량제 봉투"],
      },
      lg: {
        enabled: false, // U+멤버십 혜택 없음
        discountRate: 0,
      },
    },
    naverMembership: {
      enabled: true,
      instantDiscountRate: 0.05, // 5% 즉시 할인
      pointRate: 0.05, // 5% 포인트 적립
      maxPointAmount: 5000, // 최대 5,000원 적립
      productRestriction: "all", // 모든 상품에 적용
      restrictions: ["1일 1회 최대 5,000원 적립", "복합결제 불가"],
    },
    naverPayWeekend: {
      enabled: true,
      minAmount: 2000,
      cashbackAmount: 500,
    },
    kakaoPay: {
      enabled: false, // 카카오페이 굿딜 비활성화
      discountRate: 0,
      restrictions: [],
    },
  },
  {
    storeId: "3", // 세븐일레븐
    carrierMembership: {
      skt: {
        enabled: true,
        discountRate: 0.1, // 1,000원당 100원
        restrictions: ["1일 1회"],
        excludedProducts: ["행사 상품", "담배", "주류", "종량제 봉투"],
      },
      kt: {
        enabled: false, // KT멤버십 혜택 없음
        discountRate: 0,
      },
      lg: {
        enabled: false, // U+멤버십 혜택 없음
        discountRate: 0,
      },
    },
    naverMembership: {
      enabled: false, // 네이버멤버십 혜택 없음
      instantDiscountRate: 0,
      pointRate: 0,
      maxPointAmount: 0,
      productRestriction: "all", // 의미 없음 (활성화되지 않음)
      restrictions: [],
    },
    naverPayWeekend: {
      enabled: true,
      minAmount: 2000,
      cashbackAmount: 500,
    },
    kakaoPay: {
      enabled: false, // 카카오페이 굿딜 비활성화
      discountRate: 0,
      restrictions: [],
    },
  },
  {
    storeId: "4",
    carrierMembership: {
      skt: {
        enabled: false,
        discountRate: 0,
      },
      kt: {
        enabled: true,
        discountRate: 0.1, // 1,000원당 100원 할인
        restrictions: ["1일 1회 사용 가능"],
        excludedProducts: ["행사 상품", "담배", "주류", "종량제 봉투 등"],
      },
      lg: {
        enabled: false,
        discountRate: 0,
      },
    },
    naverMembership: {
      enabled: false,
      instantDiscountRate: 0,
      pointRate: 0,
      maxPointAmount: 0,
      productRestriction: "all",
    },
    naverPayWeekend: {
      enabled: true,
      minAmount: 2000,
      cashbackAmount: 500,
    },
    kakaoPay: {
      enabled: true,
      discountRate: 0.03, // 3% 할인
      restrictions: ["카카오페이 굿딜로 결제 시 적용"],
    },
  },
  {
    storeId: "5", // 메가커피
    carrierMembership: {
      skt: {
        enabled: true,
        discountRate: 0.2, // 20% 할인
        restrictions: ["1일 1회"],
        excludedProducts: ["행사 메뉴"],
      },
      kt: {
        enabled: false,
        discountRate: 0,
      },
      lg: {
        enabled: false,
        discountRate: 0,
      },
    },
    naverMembership: {
      enabled: false,
      instantDiscountRate: 0,
      pointRate: 0,
      maxPointAmount: 0,
      productRestriction: "all",
    },
    naverPayWeekend: {
      enabled: false,
      minAmount: 0,
      cashbackAmount: 0,
    },
    kakaoPay: {
      enabled: true,
      discountRate: 0.05, // 5% 할인
      restrictions: ["카카오페이 굿딜로 결제 시 적용"],
    },
  },
];

// 매장 ID로 할인 정책 가져오기
export function getDiscountRules(storeId: string): IDiscountRule | null {
  return DISCOUNT_RULES.find((rule) => rule.storeId === storeId) || null;
}
