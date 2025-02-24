export interface IDiscountInfo {
  id: string;
  type: DiscountType;
  provider: string;
  description: string;
  conditions: string[];
  discountRate?: number;
  discountAmount?: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  validDays?: string[];
  validTime?: string;
  membershipTier?: string[];
  registrationRequired?: boolean;
  registrationLink?: string;
  targetItems?: string[];
}

export enum DiscountType {
  NAVERPAY = "네이버페이",
  MEMBERSHIP = "멤버십",
  NAVERMEMBERSHIP = "네이버 멤버십",
  SPECIAL = "특별할인",
}

export interface IStoreDiscount {
  storeId: string;
  storeName: string;
  discounts: IDiscountInfo[];
}
