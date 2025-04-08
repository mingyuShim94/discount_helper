/**
 * DiscountLineItem 컴포넌트
 *
 * 할인 영수증에 표시되는 각 항목 라인을 렌더링하는 재사용 가능한 컴포넌트입니다.
 */

import React from "react";

/**
 * 할인 세부 내역 항목 컴포넌트 Props
 */
export interface IDiscountLineItemProps {
  label: string;
  amount: number;
  type?: "regular" | "discount" | "total" | "final";
}

/**
 * 할인 항목 라인 컴포넌트
 *
 * 영수증의 각 항목 라인을 표시합니다.
 */
const DiscountLineItem = React.memo(
  ({ label, amount, type = "regular" }: IDiscountLineItemProps) => {
    // 음수 금액은 -부호를 붙여서 표시
    const formattedAmount =
      amount < 0
        ? `-${Math.abs(amount).toLocaleString()}원`
        : `${amount.toLocaleString()}원`;

    // 타입별 스타일 설정
    let textColorClass = "text-gray-600";
    let borderClass = "";
    let fontClass = "font-normal";

    switch (type) {
      case "discount":
        textColorClass = amount < 0 ? "text-green-600" : "text-gray-600";
        break;
      case "total":
        borderClass = "border-t border-b border-dashed border-gray-300";
        fontClass = "font-medium";
        break;
      case "final":
        textColorClass = "text-red-600";
        fontClass = "font-medium";
        break;
    }

    return (
      <div
        className={`flex justify-between items-center py-1 ${borderClass}`}
        data-testid={`discount-line-item-${type}`}
      >
        <span className={`${textColorClass} ${fontClass}`}>{label}</span>
        <span className={`${textColorClass} ${fontClass}`}>
          {formattedAmount}
        </span>
      </div>
    );
  }
);

DiscountLineItem.displayName = "DiscountLineItem";

export default DiscountLineItem;
