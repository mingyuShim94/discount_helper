매장 선택 후 할인 정보 확인 유스케이스를 구현하기 위한 설계를 진행하겠습니다.

### 1. 타입 정의 (types/discount.ts)

```typescript:types/discount.ts
export interface IDiscountInfo {
  id: string;
  type: DiscountType;
  provider: string;
  description: string;
  conditions: string[];
  discountRate: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  validDays?: string[];
  validTime?: string;
  membershipTier?: string;
  registrationRequired?: boolean;
  registrationLink?: string;
}

export enum DiscountType {
  SIMPLE_PAYMENT = "간편결제",
  MEMBERSHIP = "멤버십",
  CREDIT_CARD = "신용카드",
  CHECK_CARD = "체크카드",
  SPECIAL = "특별할인"
}

export interface IStoreDiscount {
  storeId: string;
  discounts: IDiscountInfo[];
}
```

### 2. API 구현 (app/api/stores/[id]/discounts/route.ts)

```typescript:app/api/stores/[id]/discounts/route.ts
import { NextResponse } from "next/server";
import { IStoreDiscount } from "@/types/discount";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: 실제 DB 연동 시 구현
    const discounts = await fetchStoreDiscounts(params.id);
    return NextResponse.json(discounts);
  } catch (error) {
    return NextResponse.json(
      { error: "할인 정보를 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
```

### 3. 할인 정보 Hook (hooks/useStoreDiscounts.ts)

```typescript:hooks/useStoreDiscounts.ts
import { useState, useEffect } from "react";
import { IStoreDiscount } from "@/types/discount";

export function useStoreDiscounts(storeId: string) {
  const [discounts, setDiscounts] = useState<IStoreDiscount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/stores/${storeId}/discounts`);
        if (!response.ok) throw new Error("할인 정보를 불러오는데 실패했습니다.");
        const data = await response.json();
        setDiscounts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("알 수 없는 오류가 발생했습니다."));
      } finally {
        setIsLoading(false);
      }
    };

    if (storeId) {
      fetchDiscounts();
    }
  }, [storeId]);

  return { discounts, isLoading, error };
}
```

### 4. 할인 정보 컴포넌트 (components/discount/DiscountList.tsx)

```typescript:components/discount/DiscountList.tsx
import { IDiscountInfo, DiscountType } from "@/types/discount";

interface IDiscountListProps {
  discounts: IDiscountInfo[];
}

export function DiscountList({ discounts }: IDiscountListProps) {
  const groupedDiscounts = discounts.reduce((acc, discount) => {
    const type = discount.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(discount);
    return acc;
  }, {} as Record<DiscountType, IDiscountInfo[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedDiscounts).map(([type, typeDiscounts]) => (
        <div key={type} className="bg-card rounded-lg p-4">
          <h3 className="text-xl font-bold mb-4">{type}</h3>
          <div className="space-y-4">
            {typeDiscounts.map((discount) => (
              <DiscountCard key={discount.id} discount={discount} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 5. 상세 페이지 구현 (app/store/[id]/page.tsx)

```typescript:app/store/[id]/page.tsx
"use client";

import { useStoreDiscounts } from "@/hooks/useStoreDiscounts";
import { DiscountList } from "@/components/discount/DiscountList";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

export default function StorePage({ params }: { params: { id: string } }) {
  const { discounts, isLoading, error } = useStoreDiscounts(params.id);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!discounts) return <ErrorMessage message="할인 정보가 없습니다." />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{discounts.storeName} 할인 정보</h1>
      <DiscountList discounts={discounts.discounts} />
    </div>
  );
}
```

### SOLID 원칙 준수 설명

1. **단일 책임 원칙 (SRP)**

   - 각 컴포넌트와 훅이 하나의 책임만 가짐
   - DiscountList는 할인 정보 표시만 담당
   - useStoreDiscounts는 데이터 fetching만 담당

2. **개방-폐쇄 원칙 (OCP)**

   - DiscountType enum을 통해 새로운 할인 유형 추가 가능
   - 컴포넌트 구조가 확장에는 열려있고 수정에는 닫혀있음

3. **리스코프 치환 원칙 (LSP)**

   - 인터페이스를 통한 타입 정의로 일관성 보장
   - 모든 할인 정보가 IDiscountInfo 인터페이스를 따름

4. **인터페이스 분리 원칙 (ISP)**

   - 각 컴포넌트가 필요한 props만 정의
   - 불필요한 의존성 제거

5. **의존성 역전 원칙 (DIP)**
   - 구체적인 구현보다 추상화된 인터페이스에 의존
   - API 호출 로직을 훅으로 분리하여 재사용성 확보

### 구현 시 주의사항

1. 에러 처리와 로딩 상태 관리를 철저히 해야 합니다.
2. 실제 DB 연동 시 데이터 구조를 고려한 스키마 설계가 필요합니다.
3. 성능 최적화를 위해 캐싱 전략을 고려해야 합니다.
4. 접근성(a11y)을 고려한 마크업이 필요합니다.
