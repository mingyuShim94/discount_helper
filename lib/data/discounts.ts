import { IDiscountInfo, DiscountType } from "@/types/discount";

// 매장별 할인 정보
export const STORE_DISCOUNTS: Record<
  string,
  { storeName: string; discounts: IDiscountInfo[] }
> = {
  // GS25 할인 정보
  "1": {
    storeName: "GS25",
    discounts: [
      {
        id: "gs25-naver-membership",
        type: DiscountType.NAVERMEMBERSHIP,
        title: "네이버 멤버십",
        description: "10% 즉시할인 + 10% 즉시적립",
        conditions: "POP 로고 있는 상품만 해당 (제한적)",
        validUntil: "",
      },
      {
        id: "gs25-kt-membership",
        type: DiscountType.MEMBERSHIP,
        title: "KT 멤버십",
        description: "등급별 할인 혜택",
        conditions:
          "VVIP/VIP/골드: 1,000원당 100원 할인, 실버/화이트/일반: 1,000원당 50원 할인",
        validUntil: "",
      },
      {
        id: "gs25-lg-membership",
        type: DiscountType.MEMBERSHIP,
        title: "LG 멤버십",
        description: "등급별 할인 혜택",
        conditions: "VVIP/VIP: 10% 할인, 다이아몬드: 5% 할인",
        validUntil: "",
      },
      {
        id: "gs25-naverpay",
        type: DiscountType.NAVERPAY,
        title: "네이버페이",
        description: "2,000원 이상 결제시 1,000원 할인",
        conditions: "금/토/일만 사용 가능, 매주 금요일 재신청 필요",
        validUntil: "2025-12-31",
        registrationLink: "https://campaign2.naver.com/npay/fridays2/",
      },
    ],
  },

  // CU 할인 정보
  "2": {
    storeName: "CU",
    discounts: [
      {
        id: "cu-naver-membership",
        type: DiscountType.NAVERMEMBERSHIP,
        title: "네이버 멤버십",
        description: "5% 즉시할인 + 5% 즉시적립",
        conditions: "1일 1회 제한",
        validUntil: "",
      },
      {
        id: "cu-skt-membership",
        type: DiscountType.MEMBERSHIP,
        title: "SKT T멤버십",
        description: "등급별 할인 혜택",
        conditions: "VIP/골드: 1,000원당 100원 할인, 실버: 1,000원당 50원 할인",
        validUntil: "",
      },
      {
        id: "cu-kt-membership",
        type: DiscountType.MEMBERSHIP,
        title: "KT 멤버십",
        description: "간편식 한정 할인",
        conditions: "간편식 한정 오전 5~9시 1,000원당 200원 할인",
        validUntil: "",
      },
      {
        id: "cu-naverpay",
        type: DiscountType.NAVERPAY,
        title: "네이버페이",
        description: "2,000원 이상 결제시 1,000원 할인",
        conditions: "금/토/일만 사용 가능, 매주 금요일 재신청 필요",
        validUntil: "2025-12-31",
        registrationLink: "https://campaign2.naver.com/npay/fridays2/",
      },
    ],
  },

  // 이마트24 할인 정보
  "3": {
    storeName: "이마트24",
    discounts: [
      {
        id: "emart24-kt-membership",
        type: DiscountType.MEMBERSHIP,
        title: "KT 멤버십",
        description: "등급별 할인 혜택",
        conditions:
          "VVIP/VIP/골드: 1,000원당 100원 할인, 실버/화이트/일반: 1,000원당 50원 할인",
        validUntil: "",
      },
      {
        id: "emart24-special",
        type: DiscountType.SPECIAL,
        title: "이마트24",
        description: "5,000원 이상 결제 시 1,000원 할인",
        conditions: "매월 1장 제공",
        validUntil: "",
        tipLinks: [
          {
            title: "네이버페이 쿠폰 찾는 방법",
            url: "/tips/emart24-naver-pay-discount-tips",
          },
          {
            title: "카카오페이 쿠폰 찾는 방법",
            url: "/tips/emart24-kakao-pay-discount-tips",
          },
        ],
      },
      {
        id: "emart24-naverpay",
        type: DiscountType.NAVERPAY,
        title: "네이버페이",
        description: "2,000원 이상 결제시 1,000원 할인",
        conditions: "금/토/일만 사용 가능, 매주 금요일 재신청 필요",
        validUntil: "2025-12-31",
        registrationLink: "https://campaign2.naver.com/npay/fridays2/",
      },
    ],
  },

  // 세븐일레븐 할인 정보
  "4": {
    storeName: "세븐일레븐",
    discounts: [
      {
        id: "711-skt-membership",
        type: DiscountType.MEMBERSHIP,
        title: "SKT T멤버십",
        description: "등급별 할인 혜택",
        conditions: "VIP/골드: 1,000원당 100원 할인, 실버: 1,000원당 50원 할인",
        validUntil: "",
      },
      {
        id: "711-naverpay",
        type: DiscountType.NAVERPAY,
        title: "네이버페이",
        description: "2,000원 이상 결제시 1,000원 할인",
        conditions: "금/토/일만 사용 가능, 매주 금요일 재신청 필요",
        validUntil: "2025-12-31",
        registrationLink: "https://campaign2.naver.com/npay/fridays2/",
      },
    ],
  },

  // 메가커피 할인 정보
  "5": {
    storeName: "메가커피",
    discounts: [
      {
        id: "mega-naverpay",
        type: DiscountType.NAVERPAY,
        title: "네이버페이",
        description: "2,000원 이상 결제시 500원 할인",
        conditions: "매주 월요일 재신청 필요, 해당 주 일요일까지 사용 가능",
        validUntil: "",
        registrationLink: "https://campaign2.naver.com/npay/cafe/",
      },
      {
        id: "mega-kakaopay",
        type: DiscountType.KAKAOPAY,
        title: "카카오페이 첫 결제 30% 할인",
        description: "5,000원 이상 결제시 30% 할인 (최대 2,000원)",
        conditions: "카카오페이머니로 첫 결제 시에만 적용, 매장 결제만 가능",
        validUntil: "2025-03-09",
        tipLinks: [
          {
            title: "카페 카카오페이 할인 받는 방법",
            url: "/tips/cafe-kakao-pay-first-payment-discount",
          },
        ],
      },
    ],
  },

  // 컴포즈커피 할인 정보
  "6": {
    storeName: "컴포즈커피",
    discounts: [
      {
        id: "compose-naverpay",
        type: DiscountType.NAVERPAY,
        title: "네이버페이",
        description: "2,000원 이상 결제시 500원 할인",
        conditions: "매주 월요일 재신청 필요, 해당 주 일요일까지 사용 가능",
        validUntil: "",
        registrationLink: "https://campaign2.naver.com/npay/cafe/",
      },
    ],
  },

  // 스타벅스 할인 정보
  "7": {
    storeName: "스타벅스",
    discounts: [],
  },

  // 투썸플레이스 할인 정보
  "8": {
    storeName: "투썸플레이스",
    discounts: [
      {
        id: "twosome-kakaopay",
        type: DiscountType.KAKAOPAY,
        title: "카카오페이 첫 결제 30% 할인",
        description: "5,000원 이상 결제시 30% 할인 (최대 2,000원)",
        conditions: "카카오페이머니로 첫 결제 시에만 적용, 매장 결제만 가능",
        validUntil: "2025-03-09",
        tipLinks: [
          {
            title: "카페 카카오페이 할인 받는 방법",
            url: "/tips/cafe-kakao-pay-first-payment-discount",
          },
        ],
      },
    ],
  },

  // 이디야커피 할인 정보
  "9": {
    storeName: "이디야커피",
    discounts: [
      {
        id: "ediya-kakaopay",
        type: DiscountType.KAKAOPAY,
        title: "카카오페이 첫 결제 30% 할인",
        description: "5,000원 이상 결제시 30% 할인 (최대 2,000원)",
        conditions: "카카오페이머니로 첫 결제 시에만 적용, 매장 결제만 가능",
        validUntil: "2025-03-09",
        tipLinks: [
          {
            title: "카페 카카오페이 할인 받는 방법",
            url: "/tips/cafe-kakao-pay-first-payment-discount",
          },
        ],
      },
    ],
  },

  // 할리스 할인 정보
  "10": {
    storeName: "할리스",
    discounts: [
      {
        id: "hollys-kakaopay",
        type: DiscountType.KAKAOPAY,
        title: "카카오페이 첫 결제 30% 할인",
        description: "5,000원 이상 결제시 30% 할인 (최대 2,000원)",
        conditions: "카카오페이머니로 첫 결제 시에만 적용, 매장 결제만 가능",
        validUntil: "2025-03-09",
        tipLinks: [
          {
            title: "카페 카카오페이 할인 받는 방법",
            url: "/tips/cafe-kakao-pay-first-payment-discount",
          },
        ],
      },
    ],
  },

  // 빽다방 할인 정보
  "11": {
    storeName: "빽다방",
    discounts: [
      {
        id: "paikdabang-kakaopay",
        type: DiscountType.KAKAOPAY,
        title: "카카오페이 첫 결제 30% 할인",
        description: "5,000원 이상 결제시 30% 할인 (최대 2,000원)",
        conditions: "카카오페이머니로 첫 결제 시에만 적용, 매장 결제만 가능",
        validUntil: "2025-03-09",
        tipLinks: [
          {
            title: "카페 카카오페이 할인 받는 방법",
            url: "/tips/cafe-kakao-pay-first-payment-discount",
          },
        ],
      },
    ],
  },
};
