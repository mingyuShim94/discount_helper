"use client";

import { useState } from "react";
import { DiscountFilter, IDiscountFilter } from "./DiscountFilter";
import { DiscountList } from "./DiscountList";
import { IDiscountInfo } from "@/types/discount";
import { filterDiscounts } from "@/lib/discount/filterDiscounts";

interface FilteredDiscountsProps {
  discounts: IDiscountInfo[];
}

export function FilteredDiscounts({ discounts }: FilteredDiscountsProps) {
  const [filteredDiscounts, setFilteredDiscounts] = useState(discounts);

  const handleFilterChange = (filter: IDiscountFilter) => {
    const filtered = filterDiscounts(discounts, filter);
    setFilteredDiscounts(filtered);
  };

  return (
    <>
      <DiscountFilter onFilterChange={handleFilterChange} />
      {filteredDiscounts.length > 0 ? (
        <DiscountList discounts={filteredDiscounts} />
      ) : (
        <p className="text-center text-muted-foreground">
          선택하신 조건에 해당하는 할인 정보가 없습니다.
        </p>
      )}
    </>
  );
}
