"use client";

import { useEffect, useRef } from "react";

// AdSense를 위한 전역 타입 선언
declare global {
  interface Window {
    adsbygoogle: Array<{
      [key: string]: unknown;
    }>;
  }
}

interface IAdSenseProps {
  client?: string;
  slot: string;
  format?: "auto" | "fluid";
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const AdSense: React.FC<IAdSenseProps> = ({
  client = "ca-pub-5294358720517664",
  slot,
  format = "auto",
  responsive = true,
  style,
  className,
}) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      if (adRef.current && adRef.current.children.length === 0) {
        const adsbygoogle = window.adsbygoogle || [];
        adsbygoogle.push({});
      }
    } catch (err) {
      console.error("AdSense 에러:", err);
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className || ""}`}
      style={style || { display: "block" }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    />
  );
};
