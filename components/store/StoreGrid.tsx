import { useRouter } from "next/navigation";
import { StoreCard } from "./StoreCard";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { ErrorMessage } from "../ui/ErrorMessage";
import { IStore, StoreCategory } from "@/types/store";

interface IStoreGridProps {
  stores: IStore[];
  isLoading: boolean;
  error?: Error | null;
  onFavoriteToggle: (storeId: string) => void;
}

export function StoreGrid({
  stores,
  isLoading,
  error,
  onFavoriteToggle,
}: IStoreGridProps) {
  const router = useRouter();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  const handleStoreClick = (storeId: string) => {
    router.push(`/store/${storeId}`);
  };

  // 카테고리별로 매장 그룹화
  const storesByCategory = stores.reduce((acc, store) => {
    const category = store.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(store);
    return acc;
  }, {} as Record<StoreCategory, IStore[]>);

  return (
    <div className="space-y-8">
      {Object.entries(storesByCategory).map(([category, categoryStores]) => (
        <div key={category}>
          <h2 className="text-2xl font-bold mb-4">{category}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categoryStores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onStoreClick={handleStoreClick}
                onFavoriteClick={onFavoriteToggle}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
