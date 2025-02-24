import { NextResponse } from "next/server";
import { StoreCategory } from "@/types/store";

// 임시 데이터
const mockStores = [
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
    name: "이마트24",
    category: StoreCategory.CONVENIENCE,
    thumbnail: "/images/stores/emart24.png",
    isFavorite: false,
  },
  {
    id: "4",
    name: "세븐일레븐",
    category: StoreCategory.CONVENIENCE,
    thumbnail: "/images/stores/711.png",
    isFavorite: false,
  },
  {
    id: "5",
    name: "메가커피",
    category: StoreCategory.CAFE,
    thumbnail: "/images/stores/megacoffee.png",
    isFavorite: false,
  },
  {
    id: "6",
    name: "컴포즈커피",
    category: StoreCategory.CAFE,
    thumbnail: "/images/stores/compose.png",
    isFavorite: false,
  },
  {
    id: "7",
    name: "스타벅스",
    category: StoreCategory.CAFE,
    thumbnail: "/images/stores/starbucks.png",
    isFavorite: false,
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query = searchParams.get("query");

    let filteredStores = [...mockStores];

    if (category) {
      filteredStores = filteredStores.filter(
        (store) => store.category === category
      );
    }

    if (query) {
      filteredStores = filteredStores.filter((store) =>
        store.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    return NextResponse.json({
      stores: filteredStores,
      totalCount: filteredStores.length,
    });
  } catch (error) {
    console.error("Store list error:", error);
    return NextResponse.json(
      { error: "매장 목록을 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
