import { StoreCard } from "./StoreCard";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { ErrorMessage } from "../ui/ErrorMessage";
import { StoreCategory } from "@/types/store";
import { useStores } from "@/hooks/useStores";

interface IStoreGridProps {
  category?: StoreCategory;
  query?: string;
}

export function StoreGrid({ category, query }: IStoreGridProps) {
  const { stores, isLoading, error, toggleFavorite } = useStores({
    category,
    query,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!stores.length) return <div>매장이 없습니다.</div>;

  return (
    <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
      {stores.map((store) => (
        <StoreCard
          key={store.id}
          store={store}
          onFavoriteToggle={toggleFavorite}
        />
      ))}
    </div>
  );
}
