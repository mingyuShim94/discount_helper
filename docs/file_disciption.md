# 할인도우미 프로젝트 코드 구조 및 주요 파일 설명

이 문서는 할인도우미 프로젝트의 주요 파일들과 각 파일의 핵심 기능을 설명합니다.

## 폴더 구조

```
discount_helper/
  ├── app/                    # Next.js App Router 페이지
  │   ├── store/              # 매장 관련 페이지
  │   │   └── [id]/           # 개별 매장 페이지 (동적 라우팅)
  │   ├── tips/               # 할인 팁 페이지
  │   └── contact/            # 문의 페이지
  ├── components/             # 컴포넌트
  │   ├── discount/           # 할인 관련 컴포넌트
  │   ├── ui/                 # UI 공통 컴포넌트 (ShadCN)
  │   ├── layout/             # 레이아웃 컴포넌트
  │   ├── tips/               # 할인 팁 컴포넌트
  │   └── store/              # 매장 관련 컴포넌트
  ├── lib/                    # 유틸리티 라이브러리
  │   ├── data/               # 정적 데이터
  │   └── discount/           # 할인 관련 유틸리티
  ├── utils/                  # 유틸리티 함수
  ├── types/                  # TypeScript 타입 정의
  ├── hooks/                  # React 커스텀 훅
  └── public/                 # 정적 파일
```

## 핵심 파일 설명

### 할인 계산 로직

#### `utils/discountCalculator.ts`

할인도우미의 핵심 기능을 담당하는 파일로, 사용자가 선택한 할인 수단에 따라 최적의 할인 방법을 계산합니다.

주요 기능:

- `calculateOptimalDiscounts`: 입력 금액에 대한 최적 할인 조합 계산
- `getBestDiscountBreakpoints`: 할인 방법이 변경되는 금액 구간 자동 탐지
- 통신사 멤버십, 네이버 멤버십, 할인카드 등 다양한 할인 수단 조합 처리
- POP 로고 유무에 따른 할인 계산
- 통신사 멤버십(KT, U+)의 최소 결제 금액(1,000원) 조건 적용

#### `utils/discountUtils.ts`

할인 계산을 위한 보조 유틸리티 함수들을 제공합니다.

주요 기능:

- `findOptimalDiscounts`: 금액에 따른 최적 할인 방법 탐색
- `calculateDiscount`: 단일 할인에 대한 할인액 계산
- 중복 할인 처리 및 순위 부여

### 컴포넌트

#### `components/discount/DiscountFilter.tsx`

할인 수단 선택을 위한 필터 컴포넌트입니다.

주요 기능:

- 멤버십 선택 (통신사 멤버십, 네이버 멤버십)
- 결제 방법 선택 (네이버페이, 할인카드)
- 할인카드 할인률 직접 입력
- 선택된 필터 상태 관리 및 부모 컴포넌트로 전달

#### `components/discount/DiscountResult.tsx`

선택된 할인 수단에 따른 최적 할인 결과를 표시하는 컴포넌트입니다.

주요 기능:

- 금액 입력 및 POP 로고 유무 선택 UI
- 현재 금액에 대한 최적 할인 조합 목록 표시
- 할인 방법이 변경되는 금액 구간 시각화
- 할인액, 최종 금액, 할인율 정보 제공

### 페이지

#### `app/store/[id]/page.tsx`

개별 매장의 할인 정보를 보여주는 페이지입니다.

주요 기능:

- 매장 정보 로드 및 표시
- DiscountFilter와 DiscountResult 컴포넌트 조합
- 할인 필터 상태 관리
- 로딩 및 에러 상태 처리

### 타입 정의

#### `types/discountFilter.ts`

할인 필터 관련 타입 정의를 제공합니다.

주요 타입:

- `IDiscountFilter`: 사용자가 선택한 할인 수단 정보를 담는 인터페이스
  - 통신사 멤버십 (T, KT, U+)
  - 네이버 멤버십
  - 결제 방법 (네이버페이, 카카오페이, 토스페이)
  - 할인카드 설정

#### `types/discount.ts`

할인 정보 관련 타입 정의를 제공합니다.

주요 타입:

- `DiscountType`: 할인 유형 열거형 (멤버십, 간편결제, 카드 등)
- `IDiscountInfo`: 할인 정보 인터페이스
- `IDiscountCalculationResult`: 할인 계산 결과 인터페이스

### 데이터 및 유틸리티

#### `lib/data/stores.ts`

매장 정보 데이터를 관리합니다.

주요 기능:

- 매장 목록 및 상세 정보 제공
- 매장 카테고리 정보

#### `lib/data/discounts.ts`

매장별 할인 정보 데이터를 관리합니다.

주요 기능:

- 매장별 할인 수단 목록
- 할인 상세 정보 (할인율, 조건, 제한사항 등)

#### `lib/discount/filterDiscounts.ts`

선택된 필터에 따라 적용 가능한 할인을 필터링합니다.

주요 기능:

- 사용자 선택에 따른 할인 필터링
- 통신사 멤버십, 네이버 멤버십, 결제 방법별 할인 필터링

### 커스텀 훅

#### `hooks/useStoreDiscounts.ts`

매장별 할인 정보를 로드하는 커스텀 훅입니다.

주요 기능:

- 매장 ID에 따른 할인 정보 로드
- 로딩 및 에러 상태 관리
