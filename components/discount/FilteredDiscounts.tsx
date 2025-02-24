"use client";

import { useState } from "react";
import { DiscountFilter, IDiscountFilter } from "./DiscountFilter";
import { DiscountList } from "./DiscountList";
import { IDiscountInfo } from "@/types/discount";
import { filterDiscounts } from "@/lib/discount/filterDiscounts";

interface FilteredDiscountsProps {
  discounts: IDiscountInfo[];
}

// 필터 초기값 설정
const initialFilter: IDiscountFilter = {
  carrier: "skt", // SKT 멤버십으로 초기값 설정
  useNaverPay: true, // 네이버페이 사용 체크
  useNaverMembership: true, // 네이버 멤버십 사용 체크
};

export function FilteredDiscounts({ discounts }: FilteredDiscountsProps) {
  const [filter, setFilter] = useState<IDiscountFilter>(initialFilter);

  const filteredDiscounts = filterDiscounts(discounts, filter);

  return (
    <div>
      <DiscountFilter
        filter={filter}
        onFilterChange={setFilter}
        discounts={discounts}
      />
      <DiscountList discounts={filteredDiscounts} />
    </div>
  );
}
