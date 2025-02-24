import { Suspense } from "react";
import { FilteredDiscounts } from "@/components/discount/FilteredDiscounts";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card } from "@/components/ui/card";
import { useStoreDiscounts } from "@/hooks/useStoreDiscounts";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

interface PageProps {
  params: { id: string };
}

export default function StorePage({ params }: PageProps) {
  const { discounts, isLoading, error } = useStoreDiscounts(params.id);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {discounts.storeName} 할인 정보
      </h1>
      <Suspense fallback={<LoadingSpinner />}>
        <Card className="p-6">
          <FilteredDiscounts discounts={discounts} />
        </Card>
      </Suspense>
    </div>
  );
}
