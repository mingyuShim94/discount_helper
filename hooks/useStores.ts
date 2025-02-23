import { useState, useEffect } from "react";
import { IStore } from "@/types/store";
import { fetchStores } from "@/lib/api/store";

export function useStores() {
  const [stores, setStores] = useState<IStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadStores = async () => {
      try {
        setIsLoading(true);
        const data = await fetchStores();
        setStores(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("매장 정보를 불러오는데 실패했습니다.")
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadStores();
  }, []);

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
