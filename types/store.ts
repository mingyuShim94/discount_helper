export interface IStore {
  id: string;
  name: string;
  category: StoreCategory;
  imageUrl: string;
  isFavorite?: boolean;
}

export enum StoreCategory {
  CONVENIENCE = "편의점",
  CAFE = "카페",
  RESTAURANT = "음식점",
  MOVIE = "영화관",
  RETAIL = "마트/쇼핑",
  BEAUTY = "뷰티/헬스",
}

export interface IStoreGridProps {
  stores: IStore[];
  isLoading: boolean;
  error?: Error | null;
}
