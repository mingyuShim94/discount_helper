/**
 * DiscountCardItem 컴포넌트
 *
 * 할인 카드에 표시되는 각 할인 항목을 렌더링하는 메모이제이션된 컴포넌트입니다.
 */

import React from "react";
import { DiscountType, getDiscountTypeStyles } from "@/utils/discountPresenter";

/**
 * 할인 카드 항목 컴포넌트 Props
 */
export interface IDiscountCardItemProps {
  name: string;
  description: string;
  amount: number;
  type: DiscountType;
}

/**
 * 할인 카드 항목 컴포넌트
 */
const DiscountCardItem = React.memo(
  ({ name, description, amount, type }: IDiscountCardItemProps) => {
    const { bg, text, border } = getDiscountTypeStyles(type);

    return (
      <div
        className={`${bg} ${text} rounded-md p-2.5 flex items-center justify-between border-l-2 ${border}`}
        data-testid={`discount-card-item-${type}`}
      >
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          <span className="text-xs">{description}</span>
        </div>
        <span className="font-medium">{amount.toLocaleString()}원</span>
      </div>
    );
  }
);

DiscountCardItem.displayName = "DiscountCardItem";

export default DiscountCardItem;
