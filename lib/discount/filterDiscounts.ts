import { IDiscountInfo, DiscountType } from "@/types/discount";
import { IDiscountFilter } from "@/components/discount/DiscountFilter";

const carrierDiscountMap: Record<string, string[]> = {
  skt: ["711-skt-membership", "cu-skt-membership"],
  kt: ["gs25-kt-membership", "cu-kt-membership", "emart24-kt-membership"],
  lg: ["gs25-lg-membership"],
};

export function filterDiscounts(
  discounts: IDiscountInfo[],
  filter: IDiscountFilter
) {
  return discounts.filter((discount) => {
    // 통신사 멤버십 필터링
    if (discount.type === DiscountType.MEMBERSHIP) {
      if (filter.carrier === "none") return false;
      const validDiscountIds = carrierDiscountMap[filter.carrier] || [];
      return validDiscountIds.includes(discount.id);
    }

    // 네이버 멤버십 필터링
    if (
      discount.type === DiscountType.NAVERMEMBERSHIP &&
      !filter.useNaverMembership
    ) {
      return false;
    }

    // 네이버페이 필터링
    if (discount.type === DiscountType.NAVERPAY && !filter.useNaverPay) {
      return false;
    }

    // 카카오페이 필터링
    if (discount.type === DiscountType.KAKAOPAY && !filter.useKakaoPay) {
      return false;
    }

    return true;
  });
}
