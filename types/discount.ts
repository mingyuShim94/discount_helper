export interface IDiscountInfo {
  id: string;
  type: DiscountType;
  benefitType: BenefitType;
  title: string;
  description: string;
  conditions: string;
  validUntil?: string;
  registrationLink?: string;
  tipLinks?: {
    title: string;
    url: string;
  }[];
  validTime?: string;
  validDays?: string[];
  discountRate?: number;
}

export enum DiscountType {
  NAVERPAY = "네이버페이",
  KAKAOPAY = "카카오페이",
  MEMBERSHIP = "멤버십",
  NAVERMEMBERSHIP = "네이버 멤버십",
  SPECIAL = "특별할인",
  POINT = "포인트",
  CARD = "카드",
  COUPON = "쿠폰",
  PAYMENT = "결제수단",
}

export enum BenefitType {
  INSTANT_DISCOUNT = "즉시할인",
  POINT = "적립",
  CASHBACK = "캐시백",
}

export interface IStoreDiscount {
  storeId: string;
  storeName: string;
  discounts: IDiscountInfo[];
}

export interface IDiscountCalculation {
  originalAmount: number;
  instantDiscount: number;
  pointAmount: number;
  cashbackAmount: number;
  totalBenefit: number;
  finalAmount: number;
  perceivedAmount: number;
}
