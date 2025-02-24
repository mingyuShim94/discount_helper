import { useState, useEffect } from "react";
import { IStore, StoreCategory } from "@/types/store";

interface UseStoresProps {
  category?: StoreCategory;
  query?: string;
}

export function useStores({ category, query }: UseStoresProps = {}) {
  const [stores, setStores] = useState<IStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (query) params.append("query", query);

        const response = await fetch(`/api/stores?${params}`);
        if (!response.ok)
          throw new Error("매장 정보를 불러오는데 실패했습니다.");

        const data = await response.json();
        setStores(data.stores);
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

  const toggleFavorite = async (storeId: string) => {
    try {
      const response = await fetch(`/api/stores/${storeId}/favorite`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("즐겨찾기 설정에 실패했습니다.");
      }

      setStores((prev) =>
        prev.map((store) =>
          store.id === storeId
            ? { ...store, isFavorite: !store.isFavorite }
            : store
        )
      );
    } catch (error) {
      console.error("즐겨찾기 오류:", error);
    }
  };

  return { stores, isLoading, error, toggleFavorite };
}
