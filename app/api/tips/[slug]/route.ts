import { NextResponse } from "next/server";
import { mockTips } from "@/lib/api/tips";

export async function GET(
  request: Request,
  context: {
    params: {
      slug: string;
    };
  }
) {
  try {
    const slug = context.params.slug;
    const tip = mockTips.find((tip) => tip.slug === slug);

    if (!tip) {
      return NextResponse.json(
        { error: "해당 꿀팁을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ tip });
  } catch (error) {
    console.error("Tip API Error:", error);
    return NextResponse.json(
      { error: "꿀팁 정보를 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
