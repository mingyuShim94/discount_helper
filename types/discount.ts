export interface IDiscountInfo {
  id: string;
  type: DiscountType;
  title: string;
  description: string;
  conditions: string;
  validUntil?: string;
  registrationLink?: string;
  tipLinks?: {
    title: string;
    url: string;
  }[];
}

export enum DiscountType {
  NAVERPAY = "네이버페이",
  MEMBERSHIP = "멤버십",
  NAVERMEMBERSHIP = "네이버 멤버십",
  SPECIAL = "특별할인",
  POINT = "포인트",
  CARD = "카드",
  COUPON = "쿠폰",
  PAYMENT = "결제수단",
}

export interface IStoreDiscount {
  storeId: string;
  storeName: string;
  discounts: IDiscountInfo[];
}
