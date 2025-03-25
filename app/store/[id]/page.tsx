"use client";
export const runtime = "edge";

import { useEffect, useState, use } from "react";
import { IStore } from "@/types/store";
import { STORES } from "@/lib/data/stores";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  DiscountFilter,
  IDiscountFilter,
} from "@/components/discount/DiscountFilter";
import { DiscountResult } from "@/components/discount/DiscountResult";
import { DEFAULT_DISCOUNT_FILTER } from "@/types/discountFilter";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StorePage({ params }: PageProps) {
  const { id } = use(params);
  const [store, setStore] = useState<IStore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [discountFilter, setDiscountFilter] = useState<IDiscountFilter>(
    DEFAULT_DISCOUNT_FILTER
  );

  // 매장 정보 로드
  useEffect(() => {
    const fetchStore = () => {
      try {
        setIsLoading(true);

        // 정적 데이터에서 매장 정보 가져오기
        const foundStore = STORES.find((store) => store.id === id);

        if (!foundStore) {
          throw new Error("매장 정보를 찾을 수 없습니다.");
        }

        setStore(foundStore);
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

    fetchStore();
  }, [id]);

  // 할인 필터 변경 핸들러
  const handleFilterChange = (newFilter: IDiscountFilter) => {
    setDiscountFilter(newFilter);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage
          message={error?.message || "매장 정보를 로드할 수 없습니다."}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold">{store.name} 할인 정보</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 할인 수단 선택 */}
        <div className="md:col-span-1">
          <DiscountFilter
            value={discountFilter}
            onChange={handleFilterChange}
          />
        </div>

        {/* 최적 할인 정보 표시 */}
        <div className="md:col-span-2">
          <DiscountResult filter={discountFilter} />
        </div>
      </div>
    </div>
  );
}
