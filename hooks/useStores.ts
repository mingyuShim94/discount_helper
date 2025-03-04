import { useState, useEffect } from "react";
import { IStore, StoreCategory } from "@/types/store";
import { STORES } from "@/lib/data/stores";

interface UseStoresProps {
  category?: StoreCategory;
  query?: string;
}

export function useStores({ category, query }: UseStoresProps = {}) {
  const [stores, setStores] = useState<IStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStores = () => {
      try {
        setIsLoading(true);

        // 정적 데이터에서 필터링
        let filteredStores = [...STORES];

        // 카테고리 필터링
        if (category) {
          filteredStores = filteredStores.filter(
            (store) => store.category === category
          );
        }

        // 검색어 필터링
        if (query) {
          const lowerQuery = query.toLowerCase();
          filteredStores = filteredStores.filter((store) =>
            store.name.toLowerCase().includes(lowerQuery)
          );
        }

        setStores(filteredStores);
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

    fetchStores();
  }, [category, query]);

  const toggleFavorite = (storeId: string) => {
    setStores((prev) =>
      prev.map((store) =>
        store.id === storeId
          ? { ...store, isFavorite: !store.isFavorite }
          : store
      )
    );
  };

  return { stores, isLoading, error, toggleFavorite };
}
