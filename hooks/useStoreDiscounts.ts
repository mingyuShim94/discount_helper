"use client";

import { useState, useEffect } from "react";
import { IDiscountInfo } from "@/types/discount";

interface StoreDiscounts {
  storeName: string;
  discounts: IDiscountInfo[];
}

export function useStoreDiscounts(storeId: string) {
  const [storeData, setStoreData] = useState<StoreDiscounts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/stores/${storeId}/discounts`);
        if (!response.ok)
          throw new Error("할인 정보를 불러오는데 실패했습니다.");
        const data = await response.json();
        setStoreData({ storeName: data.storeName, discounts: data.discounts });
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
