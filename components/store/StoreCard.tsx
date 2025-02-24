import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { IStore } from "@/types/store";
import Image from "next/image";
import Link from "next/link";

interface IStoreCardProps {
  store: IStore;
  onFavoriteToggle: (storeId: string) => void;
}

export function StoreCard({ store, onFavoriteToggle }: IStoreCardProps) {
  return (
    <Link href={`/store/${store.id}`}>
      <Card className="group hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-2 md:p-4">
          <div className="relative w-full h-[120px] md:h-[200px] mb-2 md:mb-3">
            <Image
              src={store.thumbnail}
              alt={store.name}
              fill
              className="object-contain rounded-md"
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 50vw, 33vw"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFavoriteToggle(store.id);
              }}
              className="absolute top-1 right-1 md:top-2 md:right-2 p-1.5 md:p-2 bg-white/80 rounded-full hover:bg-white/90 transition-colors"
              aria-label={`${store.name} ${
                store.isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"
              }`}
            >
              <Heart
                className={`w-4 h-4 md:w-5 md:h-5 ${
                  store.isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-gray-500"
                }`}
              />
            </button>
          </div>
          <h3 className="font-bold text-sm md:text-lg line-clamp-1">
            {store.name}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            {store.category}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
