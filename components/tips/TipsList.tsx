"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { ITip } from "@/types/tip";

export function TipsList() {
  const [tips, setTips] = useState<ITip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/tips");
        if (!response.ok) {
          throw new Error("꿀팁 정보를 불러오는데 실패했습니다.");
        }
        const data = await response.json();
        setTips(data.tips);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("알 수 없는 오류가 발생했습니다.")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTips();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!tips.length) return <div>등록된 꿀팁이 없습니다.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tips.map((tip) => (
        <Link key={tip.id} href={`/tips/${tip.slug}`}>
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-2 line-clamp-2">
                {tip.title}
              </h2>
              <p className="text-muted-foreground line-clamp-3">
                {tip.excerpt}
              </p>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(tip.publishedAt).toLocaleDateString("ko-KR")}
              </span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
