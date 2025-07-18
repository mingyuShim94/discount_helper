# 💰 할인도우미 (Discount Helper)

> **편의점과 카페에서 최적의 할인 방법을 찾아주는 실용적인 웹 애플리케이션**

🔗 **Live Demo**: [https://halindoumi.com](https://halindoumi.com)

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?style=flat-square&logo=tailwindcss)

---

## 🎯 프로젝트 개요

한국의 복잡한 편의점/카페 할인 혜택들(통신사 멤버십, 카드사 할인, 간편결제 등)을 **실시간으로 비교 분석**하여 사용자에게 **최적의 할인 조합**을 제안하는 서비스입니다.

### 📊 해결한 문제
- **복잡한 할인 정책**: 매장별로 다른 할인율, 시간 제한, 상품 제한 등
- **할인 조합의 어려움**: 여러 할인 혜택의 중복 적용 가능 여부 판단
- **최적화의 필요성**: 동일 금액에서 가장 유리한 결제 방법 선택

---

## 🚀 핵심 기능

### 💡 스마트 할인 계산기
- **실시간 계산**: 금액 입력 시 즉시 최적 할인 방법 제안
- **복합 할인 지원**: 멤버십 + 카드할인, 멤버십 + 간편결제 조합 계산
- **수식 입력 지원**: `1200+800` 같은 계산식 입력 가능

### 🏪 매장별 맞춤 정보
- **편의점**: GS25, CU, 세븐일레븐, 이마트24
- **카페**: 메가커피, 컴포즈커피 등
- **차별화된 할인 정책**: 매장별로 다른 할인 방식과 조건 적용

### 📱 반응형 UX/UI
- **모바일**: 탭 기반의 단계별 UI 흐름
- **데스크톱**: 2단 그리드 레이아웃으로 정보 밀도 최적화
- **직관적 시각화**: 영수증 형태의 할인 결과 표시

---

## 🛠 기술 스택

### Frontend
```typescript
Next.js 15 (App Router) + React 19 + TypeScript 5
TailwindCSS 4 + ShadCN/UI + Radix UI
Lucide React (Icons)
```

### Performance & Optimization
```typescript
Turbopack (Dev Server)
Client-side Calculation (Zero Server Load)
Automatic SEO Optimization
Mobile-first Responsive Design
```

### Deployment & Monetization
```typescript
Cloudflare Pages
Google AdSense Integration
Google Search Console (SEO)
```

---

## 💻 핵심 기술적 구현

### 1. 복잡한 비즈니스 로직 처리

```typescript
// 매장별, 통신사별 차별화된 할인 계산
function calculateCarrierDiscountAmount(
  amount: number,
  storeId: string, 
  carrier: "skt" | "kt" | "lg",
  discountRate: number
): number {
  // 메가커피: 퍼센트 할인
  if (storeId === "5" && carrier === "skt") {
    return amount * discountRate;
  }
  // 편의점: 1,000원당 X원 할인
  return Math.floor(amount / 1000) * (discountRate * 1000);
}
```

**특징:**
- 매장별로 다른 할인 정책 구현 (퍼센트 vs 정액)
- 시간 제한, 상품 제한 등 복잡한 비즈니스 룰 처리
- 중복 할인 조합 계산 및 최적화 알고리즘

### 2. 타입 안전한 데이터 구조 설계

```typescript
export interface IDiscountRule {
  storeId: string;
  carrierMembership: {
    skt: {
      enabled: boolean;
      discountRate: number;
      timeRestriction?: { 
        startHour: number; 
        endHour: number; 
      };
      productRestriction?: string;
    };
    // kt, lg 동일 구조
  };
  naverMembership: { /* ... */ };
  kakaoPay: { /* ... */ };
}
```

### 3. SEO 자동화 시스템

```typescript
// 동적 사이트맵 생성
export default function sitemap(): MetadataRoute.Sitemap {
  const storePages = STORES.map((store) => ({
    url: `${baseUrl}/store/${store.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));
  
  return [...staticPages, ...storePages];
}
```

### 4. 반응형 컴포넌트 아키텍처

```typescript
// 디바이스별 차별화된 UI 제공
{isMobile ? (
  <Tabs defaultValue="optimal">
    <TabsList className="grid grid-cols-3">
      <TabsTrigger value="optimal">최적 할인</TabsTrigger>
      <TabsTrigger value="all-list">전체 목록</TabsTrigger>
      <TabsTrigger value="terms">용어 설명</TabsTrigger>
    </TabsList>
  </Tabs>
) : (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* 할인 영수증 + 비교 테이블 */}
  </div>
)}
```

---

## 📈 성과 및 특징

### 🎯 기술적 성취
- **최신 기술 스택**: Next.js 15, React 19, TailwindCSS 4 등 최신 버전 활용
- **제로 서버 로드**: 클라이언트 사이드 계산으로 서버 비용 최소화
- **완전한 타입 안전성**: TypeScript로 런타임 에러 방지
- **자동화된 SEO**: 사이트맵, 메타데이터 자동 생성

### 💼 비즈니스 가치
- **실제 서비스 운영**: 공식 도메인으로 실사용자 대상 서비스
- **수익화 모델**: Google AdSense 통합으로 광고 수익 창출
- **실용성**: 매일 사용 가능한 실생활 밀착형 서비스

### 🏗 아키텍처 설계
- **확장 가능한 구조**: 새로운 매장/할인 정책 추가 용이
- **모듈화**: 할인 로직, UI 컴포넌트, 데이터 계층 분리
- **환경별 설정**: 개발/프로덕션 환경 완전 분리

---

## 🔧 로컬 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (Turbopack 사용)
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

---

## 📱 주요 화면

### 메인 화면 - 매장 선택
- 카테고리별 매장 그리드 표시
- 검색 및 필터링 기능
- 즐겨찾기 기능

### 할인 계산기
- **모바일**: 탭 기반 단계별 UI
- **데스크톱**: 2단 그리드 레이아웃
- 실시간 할인 계산 및 최적 방법 제안

### 할인 결과 표시
- 영수증 형태의 직관적인 결과 표시
- 할인 유형별 색상 구분 (즉시할인, 적립, 캐시백)
- 할인 금액과 최종 결제 금액 명확 표시

---

## 🎨 디자인 시스템

- **일관된 컴포넌트**: ShadCN/UI + Radix UI 기반
- **접근성**: ARIA 속성, 키보드 네비게이션 지원
- **모바일 퍼스트**: 작은 화면부터 설계한 반응형 디자인
- **브랜드 아이덴티티**: 할인/절약을 상징하는 색상과 아이콘 활용

---

## 🚀 향후 개선 계획

- **AI 추천 시스템**: 사용자 패턴 분석 기반 개인화 추천
- **실시간 할인 정보**: API 연동을 통한 실시간 할인 정보 업데이트
- **사용자 계정**: 즐겨찾기, 할인 기록 저장 기능
- **모바일 앱**: PWA 또는 네이티브 앱 개발

---

> 이 프로젝트는 **실무 개발 역량**, **사용자 중심 사고**, **기술적 숙련도**, **비즈니스 이해도**를 종합적으로 보여주는 포트폴리오 프로젝트입니다.

**Contact**: [GitHub](https://github.com/your-username) | [LinkedIn](https://linkedin.com/in/your-profile)