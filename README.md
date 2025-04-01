This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

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
