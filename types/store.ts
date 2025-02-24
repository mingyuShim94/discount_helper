export enum StoreCategory {
  CONVENIENCE = "편의점",
  CAFE = "카페",
  RESTAURANT = "음식점",
  MOVIE = "영화관",
  SHOPPING = "쇼핑몰",
}

export interface IStore {
  id: string;
  name: string;
  category: StoreCategory;
  thumbnail: string;
  description?: string;
  isFavorite?: boolean;
}

export interface IStoreListResponse {
  stores: IStore[];
  totalCount: number;
}

export interface IStoreGridProps {
  stores: IStore[];
  isLoading: boolean;
  error?: Error | null;
}
