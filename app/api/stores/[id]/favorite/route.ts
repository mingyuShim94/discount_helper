export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const storeId = url.pathname.split("/").pop(); // URL에서 storeId 추출
    console.log(`Toggling favorite for store ${storeId}`);
    // 실제 DB 연동 전까지는 성공 응답만 반환
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Favorite toggle error:", error);
    return NextResponse.json(
      { error: "즐겨찾기 설정에 실패했습니다." },
      { status: 500 }
    );
  }
}
