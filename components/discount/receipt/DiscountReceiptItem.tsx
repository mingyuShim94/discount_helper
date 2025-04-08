/**
 * DiscountReceiptItem 컴포넌트
 *
 * 영수증에 표시되는 각 할인 유형별 항목을 렌더링하는 컴포넌트입니다.
 * 메모이제이션을 통해 불필요한 리렌더링을 방지합니다.
 */

import React from "react";
import { DiscountType } from "@/utils/discountPresenter";

/**
 * 할인 영수증 항목 컴포넌트 Props
 */
export interface IDiscountReceiptItemProps {
  name: string;
  description: string;
  amount: number;
  type: DiscountType;
}

/**
 * 할인 유형별 스타일 매핑
 */
const typeStyleMap: Record<
  DiscountType,
  { border: string; bgColor: string; textColor: string; darkTextColor: string }
> = {
  instant: {
    border: "border-green-400",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    darkTextColor: "text-green-600",
  },
  point: {
    border: "border-blue-400",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    darkTextColor: "text-blue-600",
  },
  cashback: {
    border: "border-yellow-400",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    darkTextColor: "text-yellow-600",
  },
};

/**
 * 할인 영수증 항목 컴포넌트
 */
const DiscountReceiptItem = React.memo(
  ({ name, description, amount, type }: IDiscountReceiptItemProps) => {
    const styles = typeStyleMap[type];

    return (
      <div
        className={`flex justify-between items-center border-l-2 ${styles.border} ${styles.bgColor} pl-2 pr-3 py-1.5 rounded`}
        data-testid={`discount-receipt-item-${type}`}
      >
        <div className="flex flex-col">
          <span className={`font-medium ${styles.textColor}`}>{name}</span>
          <span className={`text-xs ${styles.darkTextColor}`}>
            {description}
          </span>
        </div>
        <span className={`font-semibold ${styles.textColor}`}>
          {amount.toLocaleString()}원
        </span>
      </div>
    );
  }
);

DiscountReceiptItem.displayName = "DiscountReceiptItem";

export default DiscountReceiptItem;
