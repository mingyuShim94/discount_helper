import { Metadata } from "next";
import { TipsList } from "@/components/tips/TipsList";

export const metadata: Metadata = {
  title: "할인도우미 - 꿀팁 모음",
  description: "편의점과 카페 할인에 관한 유용한 꿀팁과 정보를 확인하세요.",
};

export default function TipsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">할인 꿀팁</h1>
        <p className="text-muted-foreground">
          편의점과 카페 할인에 관한 유용한 정보와 꿀팁을 확인하세요.
        </p>
      </div>

      <TipsList />
    </div>
  );
}
