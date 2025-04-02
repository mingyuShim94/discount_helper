import { StoreCard } from "./StoreCard";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { ErrorMessage } from "../ui/ErrorMessage";
import { StoreCategory, IStore } from "@/types/store";
import { useStores } from "@/hooks/useStores";
import { AdSense } from "../ads/AdSense";

interface IStoreGridProps {
  category?: StoreCategory;
  query?: string;
}

// 광고 항목 타입 정의
type AdItem = {
  type: "ad";
  id: string;
  slotId: string;
};

// 그리드에 표시될 항목 타입 (스토어 또는 광고)
type GridItem = IStore | AdItem;

export function StoreGrid({ category, query }: IStoreGridProps) {
  const { stores, isLoading, error, toggleFavorite } = useStores({
    category,
    query,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!stores.length) return <div>매장이 없습니다.</div>;

  // 광고를 포함한 스토어 목록 생성
  const itemsWithAds: GridItem[] = [...stores];

  // 매장이 6개 이상이면 6번째 위치에 광고 삽입
  if (stores.length >= 6) {
    itemsWithAds.splice(6, 0, {
      type: "ad",
      id: "ad-1",
      slotId: "1111222233",
    });
  }

  // 매장이 12개 이상이면 14번째 위치에 광고 삽입
  if (stores.length >= 12) {
    itemsWithAds.splice(14, 0, {
      type: "ad",
      id: "ad-2",
      slotId: "4444555566",
    });
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
      {itemsWithAds.map((item) => {
        // 광고 아이템인 경우
        if ("type" in item && item.type === "ad") {
          return (
            <div
              key={item.id}
              className="col-span-3 md:col-span-3 lg:col-span-4 my-4"
            >
              <AdSense
                slot={item.slotId}
                format="fluid"
                responsive={true}
                style={{
                  display: "block",
                  textAlign: "center",
                  maxWidth: "100%",
                  margin: "0 auto",
                }}
              />
            </div>
          );
        }

        // 스토어 아이템인 경우 (IStore 타입)
        const store = item as IStore; // 타입 단언
        return (
          <StoreCard
            key={store.id}
            store={store}
            onFavoriteToggle={toggleFavorite}
          />
        );
      })}
    </div>
  );
}
