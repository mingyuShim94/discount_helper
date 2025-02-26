import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "할인도우미",
  description:
    "편의점과 카페의 모든 할인 정보를 한눈에! 통신사 멤버십, 네이버페이, 카드사 할인 정보를 쉽게 확인하세요.",
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
  ],
  authors: [{ name: "할인도우미" }],
  creator: "할인도우미",
  publisher: "할인도우미",
  openGraph: {
    title: "할인도우미 - 편의점/카페 할인 정보",
    description:
      "편의점과 카페의 모든 할인 정보를 한눈에! 통신사 멤버십, 네이버페이, 카드사 할인 정보를 쉽게 확인하세요.",
    type: "website",
    locale: "ko_KR",
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
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="min-h-[calc(100vh-57px)]">{children}</main>
      </body>
    </html>
  );
}
