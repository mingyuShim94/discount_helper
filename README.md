# 💰 할인도우미 (Discount Helper)

> **편의점과 카페에서 최적의 할인 방법을 찾아주는 스마트 할인 계산기**

🔗 **서비스 URL**: [https://halindoumi.com](https://halindoumi.com)

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?style=flat-square&logo=tailwindcss)

## 🎯 프로젝트 소개

할인도우미는 한국의 복잡한 편의점/카페 할인 혜택들을 **실시간으로 비교 분석**하여 사용자에게 **최적의 할인 조합**을 제안하는 웹 서비스입니다.

### 📊 해결하는 문제
- **복잡한 할인 정책**: 매장별로 다른 할인율, 시간 제한, 상품 제한
- **할인 조합의 어려움**: 통신사 멤버십 + 간편결제 + 카드할인 등의 중복 적용 가능 여부
- **최적화의 필요성**: 동일 금액에서 가장 유리한 결제 방법 선택

### 🏪 지원 매장
- **편의점**: GS25, CU, 세븐일레븐, 이마트24
- **카페**: 메가커피, 컴포즈커피 등

### 💳 지원 할인 수단
- **통신사 멤버십**: SKT(T멤버십), KT, LG U+
- **간편결제**: 네이버페이(주말 캐시백), 카카오페이 굿딜
- **네이버 멤버십**: 즉시할인 + 포인트 적립
- **신용카드**: 사용자 맞춤 할인율

## 🚀 핵심 기능

### 💡 스마트 할인 계산기
- 금액 입력 시 즉시 최적 할인 방법 제안
- 복합 할인 조합 계산 (멤버십 + 카드, 멤버십 + 간편결제)
- 수식 입력 지원 (`1200+800` 같은 계산식 입력 가능)

### 🎯 매장별 맞춤 계산
- **GS25**: POP 로고 상품 여부에 따른 할인율 차등
- **CU**: KT 멤버십 시간대 제한 및 간편식 제품 제한
- **시간대별 할인**: 특정 시간대 한정 할인 자동 적용

### 📱 반응형 UX
- **모바일**: 탭 기반의 단계별 UI 흐름
- **데스크톱**: 2단 그리드 레이아웃으로 정보 밀도 최적화
- **직관적 시각화**: 영수증 형태의 할인 결과 표시

## 🛠 개발 환경 설정

### 로컬 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (Turbopack 사용)
npm run dev

# 브라우저에서 확인
# http://localhost:3000
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 코드 품질 검사
npm run lint
```

## SEO 최적화

이 프로젝트는 다음과 같은 SEO 최적화 기능을 포함하고 있습니다:

### 도메인

- 공식 도메인: [https://halindoumi.com](https://halindoumi.com)

### Sitemap 자동 생성

- `app/sitemap.ts` 파일을 통해 자동으로 sitemap.xml 생성
- 정적 페이지와 동적 페이지(매장 목록)를 모두 포함
- 상대적 중요도(priority)와 갱신 주기(changeFrequency) 설정
- URL: `https://halindoumi.com/sitemap.xml`

### Robots.txt

- `app/robots.ts` 파일을 통해 자동으로 robots.txt 생성
- 검색 엔진에 sitemap 위치 안내
- API 엔드포인트 등 크롤링이 불필요한 경로 차단
- URL: `https://halindoumi.com/robots.txt`

### 메타데이터 최적화

- `app/layout.tsx`에서 전역 메타데이터 설정
- OpenGraph 및 Twitter 카드 메타데이터
- 모바일 최적화 뷰포트 설정
- 각 페이지별 동적 메타데이터 생성

### 구글 서치콘솔

- 구글 서치콘솔에 등록 완료
- sitemap.xml 제출 완료
- 추가 설정 정보는 `docs/SEO_GUIDE.md` 참조

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
