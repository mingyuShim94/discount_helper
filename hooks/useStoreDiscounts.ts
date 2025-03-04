"use client";

import { useState, useEffect } from "react";
import { IDiscountInfo } from "@/types/discount";
import { STORE_DISCOUNTS } from "@/lib/data/discounts";

interface StoreDiscounts {
  storeName: string;
  discounts: IDiscountInfo[];
}

export function useStoreDiscounts(storeId: string) {
  const [storeData, setStoreData] = useState<StoreDiscounts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDiscounts = () => {
      try {
        setIsLoading(true);

        // 정적 데이터에서 매장 할인 정보 가져오기
        const discountData = STORE_DISCOUNTS[storeId];

        if (!discountData) {
          throw new Error("할인 정보를 찾을 수 없습니다.");
        }

        setStoreData({
          storeName: discountData.storeName,
          discounts: discountData.discounts,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("알 수 없는 오류가 발생했습니다.")
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (storeId) fetchDiscounts();
  }, [storeId]);

  return { storeData, isLoading, error };
}
