"use client";

import { StoreGrid } from "@/components/store/StoreGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreCategory } from "@/types/store";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { debounce } from "lodash";
import { AdSense } from "@/components/ads/AdSense";
import { usePathname } from "next/navigation";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [adKey, setAdKey] = useState(0);
  const pathname = usePathname();

  // 페이지 이동 시 AdSense 컴포넌트 재렌더링을 위한 키 업데이트
  useEffect(() => {
    setAdKey((prev) => prev + 1);
  }, [pathname]);

  const handleSearch = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            className="pl-10"
            placeholder="매장 검색..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">전체</TabsTrigger>
          {Object.values(StoreCategory).map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <StoreGrid query={searchQuery} />
        </TabsContent>

        {Object.values(StoreCategory).map((category) => (
          <TabsContent key={category} value={category}>
            <StoreGrid category={category} query={searchQuery} />
          </TabsContent>
        ))}
      </Tabs>

      {/* 인라인 배너 광고 - 콘텐츠 하단 */}
      <div
        className="w-full bg-white mt-8 border-t pt-4"
        key={`ad-banner-${adKey}`}
      >
        <AdSense
          slot="1234567890"
          style={{
            display: "block",
            textAlign: "center",
            margin: "0 auto",
            minHeight: "60px",
            maxHeight: "90px",
            overflow: "hidden",
          }}
          format="auto"
          responsive={true}
          minHeight="60px"
        />
      </div>
    </main>
  );
}
