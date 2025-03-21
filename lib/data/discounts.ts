import { IDiscountInfo, DiscountType } from "@/types/discount";

interface StoreDiscountData {
  storeName: string;
  discounts: IDiscountInfo[];
}

// 매장별 할인 정보 데이터
export const STORE_DISCOUNTS: Record<string, StoreDiscountData> = {
  "1": {
    storeName: "GS25",
    discounts: [
      {
        id: "gs25-1",
        type: DiscountType.MEMBERSHIP,
        title: "통신사 멤버십 할인",
        description: "통신사 멤버십으로 결제 시 최대 2,000원 할인",
        conditions: "SKT, KT, LG 멤버십 앱 제시 시 적용",
        discountRate: 10,
      },
      {
        id: "gs25-2",
        type: DiscountType.NAVERPAY,
        title: "네이버페이 할인",
        description: "네이버페이로 결제 시 최대 5% 할인",
        conditions: "네이버페이 결제 시 적용",
        discountRate: 5,
      },
    ],
  },
};
