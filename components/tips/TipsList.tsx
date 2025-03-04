"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { TIPS } from "@/lib/data/tips";

export function TipsList() {
  if (!TIPS.length) return <div>등록된 꿀팁이 없습니다.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {TIPS.map((tip) => (
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
