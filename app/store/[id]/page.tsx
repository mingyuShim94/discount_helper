"use client";

import { Suspense } from "react";
import { FilteredDiscounts } from "@/components/discount/FilteredDiscounts";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card } from "@/components/ui/card";
import { useStoreDiscounts } from "@/hooks/useStoreDiscounts";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { use } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StorePage({ params }: PageProps) {
  const { id } = use(params);
  const { storeData, isLoading, error } = useStoreDiscounts(id);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  if (!storeData)
    return <ErrorMessage message="할인 정보를 불러올 수 없습니다." />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {storeData.storeName} 할인 정보
      </h1>
      <Suspense fallback={<LoadingSpinner />}>
        <Card className="p-6">
          <FilteredDiscounts discounts={storeData.discounts} />
        </Card>
      </Suspense>
    </div>
  );
}
