"use client";

import { StoreGrid } from "@/components/store/StoreGrid";
import { useStores } from "@/hooks/useStores";

export default function Home() {
  const { stores, isLoading, error, toggleFavorite } = useStores();

  return (
    <main className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-8">할인도우미</h1>
      <p className="text-center text-muted-foreground mb-8">
        매장별 최적의 할인 혜택을 확인하세요
      </p>
      <StoreGrid
        stores={stores}
        isLoading={isLoading}
        error={error}
        onFavoriteToggle={toggleFavorite}
      />
    </main>
  );
}
