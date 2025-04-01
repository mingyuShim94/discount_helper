import { STORES } from "@/lib/data/stores";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // 환경 변수로부터 기본 URL 가져오기, 없다면 로컬호스트 사용
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // 현재 날짜 - lastModified 용도
  const currentDate = new Date().toISOString();

  // 정적 페이지 목록
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tips`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
  ];

  // 동적 페이지 - 매장 페이지 목록
  const storePages = STORES.map((store) => ({
    url: `${baseUrl}/store/${store.id}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // 정적 페이지와 동적 페이지 결합
  return [...staticPages, ...storePages];
}
