import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { Suspense } from "react";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://discount-helper.pages.dev";

export const metadata: Metadata = {
  title: "할인도우미 - 편의점/카페 최적의 할인 방법 찾기",
  description:
    "편의점과 카페의 모든 할인 정보를 한눈에! 통신사 멤버십(SKT, KT, LG), 네이버페이, 카드사 할인 정보를 쉽게 확인하고 최적의 할인 방법을 찾아보세요.",
  keywords: [
    "할인",
    "편의점 할인",
    "카페 할인",
    "네이버페이",
    "통신사 멤버십",
    "SKT 멤버십",
    "KT 멤버십",
    "LG 멤버십",
    "GS25",
    "CU",
    "이마트24",
    "세븐일레븐",
    "메가커피",
    "컴포즈커피",
    "할인 계산기",
    "POP 로고",
    "네이버 멤버십",
    "즉시할인",
    "캐시백",
    "포인트적립",
    "카드할인",
    "주말 캐시백",
    "최적 할인",
  ],
  authors: [{ name: "할인도우미" }],
  creator: "할인도우미",
  publisher: "할인도우미",
  applicationName: "할인도우미",
  category: "Finance",
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "할인도우미 - 편의점/카페 최적의 할인 방법 찾기",
    description:
      "편의점과 카페의 모든 할인 정보를 한눈에! 통신사 멤버십(SKT, KT, LG), 네이버페이, 카드사 할인 정보를 쉽게 확인하고 최적의 할인 방법을 찾아보세요.",
    url: BASE_URL,
    siteName: "할인도우미",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "할인도우미 - 편의점/카페 최적의 할인 방법 찾기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "할인도우미 - 편의점/카페 최적의 할인 방법 찾기",
    description:
      "편의점과 카페의 모든 할인 정보를 한눈에! 통신사 멤버십(SKT, KT, LG), 네이버페이, 카드사 할인 정보를 쉽게 확인하고 최적의 할인 방법을 찾아보세요.",
    images: [`${BASE_URL}/og-image.png`],
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="google-adsense-account" content="ca-pub-8647279125417942" />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8647279125417942"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Header />
        <main className="min-h-[calc(100vh-57px)]">{children}</main>
      </body>
    </html>
  );
}
