import { Suspense } from "react";
import { FilteredDiscounts } from "@/components/discount/FilteredDiscounts";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card } from "@/components/ui/card";

async function getStoreDiscounts(id: string) {
  // 서버 사이드에서는 전체 URL이 필요합니다
  const baseUrl = "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/stores/${id}/discounts`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("할인 정보를 불러오는데 실패했습니다.");
  return res.json();
}

export default async function StorePage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getStoreDiscounts(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{data.storeName} 할인 정보</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <Card className="p-6">
          <FilteredDiscounts discounts={data.discounts} />
        </Card>
      </Suspense>
    </div>
  );
}
