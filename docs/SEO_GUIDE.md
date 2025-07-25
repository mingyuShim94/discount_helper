# 할인도우미 SEO 최적화 가이드

## 1. Sitemap 및 Robots.txt 설정

### 구현된 파일

- `app/sitemap.ts` - 사이트맵 자동 생성
- `app/robots.ts` - 로봇 크롤링 규칙 설정

### 내용 설명

1. **sitemap.ts**

   - 정적 페이지 (홈, 할인 팁, 문의 페이지)와 동적 페이지 (매장별 페이지)를 자동으로 생성
   - 각 페이지의 중요도(priority)와 갱신 주기(changeFrequency) 설정
   - 기본 URL은 환경 변수(`NEXT_PUBLIC_BASE_URL`)에서 읽어오며, 개발/프로덕션 환경을 자동 감지
   - 프로덕션 환경: `https://halindoumi.com`
   - 개발 환경: `http://localhost:3000`

2. **robots.ts**
   - 검색 엔진 크롤러에 대한 규칙 설정
   - 일반 페이지는 모두 허용하고 API 엔드포인트는 크롤링 차단
   - 사이트맵 위치 명시: `https://halindoumi.com/sitemap.xml`

## 2. 구글 서치콘솔 제출 방법

### 1) 구글 서치콘솔 계정 및 사이트 등록

1. [Google Search Console](https://search.google.com/search-console)에 접속
2. 사이트 추가 방법 선택:
   - **URL 접두어**: 특정 URL 경로 등록 (예: `https://halindoumi.com`)
   - **도메인**: 전체 도메인과 모든 하위 도메인 등록 (예: `halindoumi.com`)

### 2) 소유권 확인

소유권 확인 방법 중 하나를 선택하여 진행:

1. **HTML 파일 업로드**:

   - 제공된 HTML 파일을 다운로드
   - `public` 폴더에 파일 저장
   - 배포 후 확인 클릭

2. **HTML 태그**:

   - 제공된 메타 태그를 복사
   - `app/layout.tsx` 파일의 `<head>` 섹션에 추가
   - 배포 후 확인 클릭

3. **DNS 레코드**:
   - 도메인 제공업체의 DNS 설정에서 제공된 TXT 레코드 추가
   - 변경사항 적용 후 확인 클릭

### 3) 사이트맵 제출

1. 왼쪽 메뉴에서 '사이트맵' 선택
2. 사이트맵 URL 입력란에 `/sitemap.xml` 입력
3. '제출' 버튼 클릭
4. 상태가 '성공'으로 표시되는지 확인

### 4) 색인 생성 모니터링

1. '색인 > 페이지' 메뉴에서 색인에 등록된 페이지 확인
2. 문제가 있는 페이지 확인 및 수정
3. 필요한 경우 개별 URL 검사 및 색인 생성 요청

## 3. 성능 최적화 및 모니터링

### 1) Core Web Vitals 개선

1. 구글 서치콘솔의 '경험' 섹션에서 Core Web Vitals 보고서 확인
2. PageSpeed Insights를 통해 개별 페이지 성능 확인
3. 개선이 필요한 항목 조치:
   - 이미지 최적화
   - 자바스크립트 번들 크기 축소
   - 레이아웃 이동 최소화
   - 서버 응답 시간 개선

### 2) 정기적인 SEO 모니터링

1. 월 1회 구글 서치콘솔 데이터 검토
2. 검색 트래픽 분석 및 개선점 도출
3. 사이트맵 업데이트 필요 시 재제출

## 4. 추가 SEO 최적화 팁

1. **URL 구조 최적화**:

   - 간결하고 의미 있는 URL 사용
   - 한글 URL은 가능한 영문으로 변환 (필요시)

2. **메타데이터 최적화**:

   - 각 페이지별 고유한 title, description 설정
   - OpenGraph 및 Twitter 카드 메타태그 활용

3. **이미지 최적화**:

   - 모든 이미지에 alt 속성 추가
   - WebP 형식 사용 고려
   - 적절한 크기로 이미지 최적화

4. **모바일 친화성**:

   - 모바일 최적화 디자인 적용
   - 모바일에서의 사용자 경험 지속적 개선

5. **구조화된 데이터 추가**:
   - 매장 정보에 LocalBusiness 스키마 적용
   - 할인 정보에 Offer 스키마 적용
   - [Schema.org](https://schema.org) 타입 활용

## 5. 도메인 변경 후 조치사항

1. **301 리디렉션 설정**:

   - 이전 도메인(`discount-helper.pages.dev`)에서 새 도메인(`halindoumi.com`)으로 301 리디렉션 설정
   - 기존 인덱싱된 URL의 SEO 가치 보존

2. **구글 서치콘솔 설정**:

   - 새 도메인을 구글 서치콘솔에 추가 제출 완료
   - 'Change of Address' 도구 사용하여 도메인 변경 알림
   - 사이트맵 재제출

3. **환경 변수 업데이트**:
   - `.env.production`에 새 도메인 URL 설정 완료
   - 배포 시 새 도메인 자동 적용
