"use client";

import { StoreGrid } from "@/components/store/StoreGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreCategory } from "@/types/store";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { debounce } from "lodash";
import { AdSense } from "@/components/ads/AdSense";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

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

      <div className="mb-8">
        <AdSense
          slot="1234567890"
          style={{ display: "block", textAlign: "center" }}
          format="auto"
          responsive={true}
        />
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

          <div className="mt-8">
            <AdSense
              slot="9876543210"
              style={{ display: "block", textAlign: "center" }}
              format="auto"
              responsive={true}
            />
          </div>
        </TabsContent>

        {Object.values(StoreCategory).map((category) => (
          <TabsContent key={category} value={category}>
            <StoreGrid category={category} query={searchQuery} />
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
}
