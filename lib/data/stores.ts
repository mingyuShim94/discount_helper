import { IStore, StoreCategory } from "@/types/store";

export const STORES: IStore[] = [
  {
    id: "1",
    name: "GS25",
    category: StoreCategory.CONVENIENCE,
    thumbnail: "/images/stores/gs25.png",
    isFavorite: false,
  },
  {
    id: "2",
    name: "CU",
    category: StoreCategory.CONVENIENCE,
    thumbnail: "/images/stores/cu.png",
    isFavorite: false,
  },
  {
    id: "3",
    name: "세븐일레븐",
    category: StoreCategory.CONVENIENCE,
    thumbnail: "/images/stores/711.png",
    isFavorite: false,
  },
  {
    id: "4",
    name: "이마트24",
    category: StoreCategory.CONVENIENCE,
    thumbnail: "/images/stores/emart24.png",
    isFavorite: false,
  },
  {
    id: "5",
    name: "메가커피",
    category: StoreCategory.CAFE,
    thumbnail: "/images/stores/mega.png",
    isFavorite: false,
  },
];
