import { NextResponse } from "next/server";
import { getTips } from "@/lib/api/tips";

export async function GET() {
  try {
    const tips = await getTips();
    return NextResponse.json({ tips });
  } catch (error) {
    console.error("Tips API Error:", error);
    return NextResponse.json(
      { error: "꿀팁 정보를 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
