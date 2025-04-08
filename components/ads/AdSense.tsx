"use client";

import { useEffect, useRef, useState } from "react";

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
  minHeight?: string;
}

export const AdSense: React.FC<IAdSenseProps> = ({
  client = "ca-pub-8647279125417942",
  slot,
  format = "auto",
  responsive = true,
  style,
  className,
  minHeight = "50px",
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    // 에러 이벤트 리스너 추가
    const handleAdError = (e: ErrorEvent) => {
      if (e.message && e.message.includes("googleads")) {
        console.log(`Ad error detected: ${e.message}`);
        setAdError(true);
      }
    };

    window.addEventListener("error", handleAdError, true);

    // 컴포넌트가 마운트된 후에만 광고 로드 시도
    const loadAd = () => {
      try {
        if (
          typeof window !== "undefined" &&
          window.adsbygoogle &&
          adRef.current &&
          adRef.current.innerHTML === ""
        ) {
          // 에러 상태 초기화
          setAdError(false);

          // 기존 광고 삽입 코드를 대체
          const ins = document.createElement("ins");
          ins.className = `adsbygoogle ${className || ""}`;
          ins.style.display = "block";

          // 필요한 데이터 속성 설정
          ins.setAttribute("data-ad-client", client);
          ins.setAttribute("data-ad-slot", slot);
          ins.setAttribute("data-ad-format", format);
          ins.setAttribute(
            "data-full-width-responsive",
            responsive ? "true" : "false"
          );

          // 스타일 적용
          if (style) {
            Object.keys(style).forEach((key) => {
              const cssKey = key.replace(
                /[A-Z]/g,
                (m) => `-${m.toLowerCase()}`
              );
              const cssValue = (style as Record<string, string | number>)[key];
              if (cssValue !== undefined) {
                ins.style.setProperty(cssKey, String(cssValue));
              }
            });
          }

          // ref에 ins 요소 추가
          adRef.current.appendChild(ins);

          // 광고 푸시
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (pushError) {
            console.error("AdSense 에러:", pushError);
            setAdError(true);
          }
        }
      } catch (err) {
        console.error("AdSense 에러:", err);
        setAdError(true);
      }
    };

    // 광고 로드
    if (document.readyState === "complete") {
      loadAd();
    } else {
      window.addEventListener("load", loadAd);
    }

    // 클린업 함수
    return () => {
      window.removeEventListener("load", loadAd);
      window.removeEventListener("error", handleAdError, true);
    };
  }, [client, slot, format, responsive, style, className]);

  // 기본 컨테이너 스타일과 사용자 지정 스타일 병합
  const containerStyle = {
    minHeight: adError ? "30px" : minHeight,
    ...style,
  };

  return <div ref={adRef} className={className} style={containerStyle} />;
};
