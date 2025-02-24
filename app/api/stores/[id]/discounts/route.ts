import { NextRequest, NextResponse } from "next/server";
import { DiscountType, IDiscountInfo } from "@/types/discount";
import { optimizeDiscounts } from "@/lib/discount/optimizeDiscounts";

const discountData: Record<string, IDiscountInfo[]> = {
  "1": [
    // GS25
    {
      id: "gs25-naver-membership",
      type: DiscountType.NAVERMEMBERSHIP,
      provider: "네이버 멤버십",
      description: "10% 즉시할인 + 10% 즉시적립",
      conditions: ["POP 로고 있는 상품만 해당 (제한적)"],
      discountRate: 10,
    },
    {
      id: "gs25-kt-membership",
      type: DiscountType.MEMBERSHIP,
      provider: "KT 멤버십",
      description: "등급별 할인 혜택",
      conditions: [
        "VVIP/VIP/골드: 1,000원당 100원 할인",
        "실버/화이트/일반: 1,000원당 50원 할인",
      ],
      validDays: ["월", "화", "수", "목", "금", "토", "일"],
    },
    {
      id: "gs25-lg-membership",
      type: DiscountType.MEMBERSHIP,
      provider: "LG 멤버십",
      description: "등급별 할인 혜택",
      conditions: ["VVIP/VIP: 10% 할인", "다이아몬드: 5% 할인"],
      validDays: ["월", "화", "수", "목", "금", "토", "일"],
    },
    {
      id: "gs25-naverpay",
      type: DiscountType.NAVERPAY,
      provider: "네이버페이",
      description: "2,000원 이상 결제시 1,000원 할인",
      conditions: ["금/토/일만 사용 가능", "매주 금요일 재신청 필요"],
      validDays: ["금", "토", "일"],
      minPurchaseAmount: 2000,
      discountAmount: 1000,
      registrationRequired: true,
      registrationLink: "https://campaign2.naver.com/npay/fridays2/",
    },
  ],
  "2": [
    // CU
    {
      id: "cu-naver-membership",
      type: DiscountType.NAVERMEMBERSHIP,
      provider: "네이버 멤버십",
      description: "5% 즉시할인 + 5% 즉시적립",
      conditions: ["1일 1회 제한"],
      discountRate: 5,
    },
    {
      id: "cu-skt-membership",
      type: DiscountType.MEMBERSHIP,
      provider: "SKT T멤버십",
      description: "등급별 할인 혜택",
      conditions: [
        "VIP/골드: 1,000원당 100원 할인",
        "실버: 1,000원당 50원 할인",
      ],
      validDays: ["월", "화", "수", "목", "금", "토", "일"],
    },
    {
      id: "cu-kt-membership",
      type: DiscountType.MEMBERSHIP,
      provider: "KT 멤버십",
      description: "간편식 한정 할인",
      conditions: ["간편식 한정 오전 5~9시 1,000원당 200원 할인"],
      validTime: "05:00~09:00",
      validDays: ["월", "화", "수", "목", "금", "토", "일"],
      targetItems: ["간편식"],
    },
    {
      id: "cu-naverpay",
      type: DiscountType.NAVERPAY,
      provider: "네이버페이",
      description: "2,000원 이상 결제시 1,000원 할인",
      conditions: ["금/토/일만 사용 가능", "매주 금요일 재신청 필요"],
      validDays: ["금", "토", "일"],
      minPurchaseAmount: 2000,
      discountAmount: 1000,
      registrationRequired: true,
      registrationLink: "https://campaign2.naver.com/npay/fridays2/",
    },
  ],
  "3": [
    // 이마트24
    {
      id: "emart24-kt-membership",
      type: DiscountType.MEMBERSHIP,
      provider: "KT 멤버십",
      description: "등급별 할인 혜택",
      conditions: [
        "VVIP/VIP/골드: 1,000원당 100원 할인",
        "실버/화이트/일반: 1,000원당 50원 할인",
      ],
      validDays: ["월", "화", "수", "목", "금", "토", "일"],
    },
    {
      id: "emart24-special",
      type: DiscountType.SPECIAL,
      provider: "이마트24",
      description: "5,000원 이상 결제 시 1,000원 할인",
      conditions: ["매월 1장 제공"],
      minPurchaseAmount: 5000,
      discountAmount: 1000,
      registrationRequired: true,
    },
    {
      id: "emart24-naverpay",
      type: DiscountType.NAVERPAY,
      provider: "네이버페이",
      description: "2,000원 이상 결제시 1,000원 할인",
      conditions: ["금/토/일만 사용 가능", "매주 금요일 재신청 필요"],
      validDays: ["금", "토", "일"],
      minPurchaseAmount: 2000,
      discountAmount: 1000,
      registrationRequired: true,
      registrationLink: "https://campaign2.naver.com/npay/fridays2/",
    },
  ],
  "4": [
    // 세븐일레븐
    {
      id: "711-skt-membership",
      type: DiscountType.MEMBERSHIP,
      provider: "SKT T멤버십",
      description: "등급별 할인 혜택",
      conditions: [
        "VIP/골드: 1,000원당 100원 할인",
        "실버: 1,000원당 50원 할인",
      ],
      validDays: ["월", "화", "수", "목", "금", "토", "일"],
    },
    {
      id: "711-naverpay",
      type: DiscountType.NAVERPAY,
      provider: "네이버페이",
      description: "2,000원 이상 결제시 1,000원 할인",
      conditions: ["금/토/일만 사용 가능", "매주 금요일 재신청 필요"],
      validDays: ["금", "토", "일"],
      minPurchaseAmount: 2000,
      discountAmount: 1000,
      registrationRequired: true,
      registrationLink: "https://campaign2.naver.com/npay/fridays2/",
    },
  ],
  "5": [
    // 메가커피
    {
      id: "mega-naverpay",
      type: DiscountType.NAVERPAY,
      provider: "네이버페이",
      description: "2,000원 이상 결제시 500원 할인",
      conditions: ["매주 월요일 재신청 필요"],
      validDays: ["월", "화", "수", "목", "금", "토", "일"],
      minPurchaseAmount: 2000,
      discountAmount: 500,
      registrationRequired: true,
      registrationLink: "https://campaign2.naver.com/npay/cafe/",
    },
  ],
  "6": [
    // 컴포즈커피
    {
      id: "compose-naverpay",
      type: DiscountType.NAVERPAY,
      provider: "네이버페이",
      description: "2,000원 이상 결제시 500원 할인",
      conditions: ["매주 월요일 재신청 필요"],
      validDays: ["월", "화", "수", "목", "금", "토", "일"],
      minPurchaseAmount: 2000,
      discountAmount: 500,
      registrationRequired: true,
      registrationLink: "https://campaign2.naver.com/npay/cafe/",
    },
  ],
};

const storeNames: Record<string, string> = {
  "1": "GS25",
  "2": "CU",
  "3": "이마트24",
  "4": "세븐일레븐",
  "5": "메가커피",
  "6": "컴포즈커피",
  "7": "스타벅스",
};

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const storeId = url.pathname.split("/").pop(); // URL에서 storeId 추출
    const discounts = discountData[storeId] || [];
    const storeName = storeNames[storeId] || storeId.toUpperCase();

    const optimizedDiscount = optimizeDiscounts(discounts);

    return NextResponse.json({
      storeId,
      storeName,
      discounts,
      optimizedDiscount,
    });
  } catch (error) {
    console.error("Discount API Error:", error);
    return NextResponse.json(
      { error: "할인 정보를 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
