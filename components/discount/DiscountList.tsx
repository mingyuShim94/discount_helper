import { IDiscountInfo } from "@/types/discount";
import { DiscountCard } from "./DiscountCard";

interface IDiscountListProps {
  discounts: IDiscountInfo[];
}

export function DiscountList({ discounts }: IDiscountListProps) {
  return (
    <div className="space-y-4">
      {discounts.map((discount) => (
        <DiscountCard key={discount.id} discount={discount} />
      ))}
    </div>
  );
}
