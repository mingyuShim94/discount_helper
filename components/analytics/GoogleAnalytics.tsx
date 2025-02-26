"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// gtag 함수에 대한 타입 선언
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      params?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  // 클라이언트 사이드에서만 실행되도록 함
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (pathname && typeof window.gtag === "function") {
      window.gtag(
        "config",
        process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string,
        {
          page_path: pathname + searchParams.toString(),
        }
      );
    }
  }, [pathname, searchParams, mounted]);

  // 서버 사이드 렌더링 중에는 아무것도 렌더링하지 않음
  if (!mounted) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `,
        }}
      />
    </>
  );
}
