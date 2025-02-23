import Image from "next/image";
import { Heart } from "lucide-react";
import { IStore } from "@/types/store";

interface IStoreCardProps {
  store: IStore;
  onStoreClick: (storeId: string) => void;
  onFavoriteClick: (storeId: string) => void;
}

export function StoreCard({
  store,
  onStoreClick,
  onFavoriteClick,
}: IStoreCardProps) {
  return (
    <div
      className="relative rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-card"
      onClick={() => onStoreClick(store.id)}
    >
      <div className="relative h-40 w-full bg-white">
        <Image
          src={store.imageUrl}
          alt={store.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-contain p-4"
          priority
        />
        <button
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white"
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteClick(store.id);
          }}
        >
          <Heart
            className={`h-5 w-5 ${
              store.isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"
            }`}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{store.name}</h3>
        <span className="inline-block mt-2 text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
          {store.category}
        </span>
      </div>
    </div>
  );
}
