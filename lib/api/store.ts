import { IStore, StoreCategory } from "@/types/store";

export async function fetchStores(): Promise<IStore[]> {
  const mockStores: IStore[] = [
    {
      id: "1",
      name: "GS25",
      category: StoreCategory.CONVENIENCE,
      imageUrl: "/images/stores/gs25.png",
      isFavorite: false,
    },
    {
      id: "2",
      name: "CU",
      category: StoreCategory.CONVENIENCE,
      imageUrl: "/images/stores/cu.png",
      isFavorite: false,
    },
    {
      id: "3",
      name: "이마트24",
      category: StoreCategory.CONVENIENCE,
      imageUrl: "/images/stores/emart24.png",
      isFavorite: false,
    },
    {
      id: "4",
      name: "세븐일레븐",
      category: StoreCategory.CONVENIENCE,
      imageUrl: "/images/stores/711.png",
      isFavorite: false,
    },
    {
      id: "5",
      name: "메가커피",
      category: StoreCategory.CAFE,
      imageUrl: "/images/stores/megacoffee.png",
      isFavorite: false,
    },
    {
      id: "6",
      name: "컴포즈커피",
      category: StoreCategory.CAFE,
      imageUrl: "/images/stores/compose.png",
      isFavorite: false,
    },
    {
      id: "7",
      name: "스타벅스",
      category: StoreCategory.CAFE,
      imageUrl: "/images/stores/starbucks.png",
      isFavorite: false,
    },
  ];

  return new Promise((resolve) => {
    setTimeout(() => resolve(mockStores), 1000);
  });
}
