"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  IDiscountFilter,
  DEFAULT_DISCOUNT_FILTER,
} from "@/types/discountFilter";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export type { IDiscountFilter } from "@/types/discountFilter";

interface DiscountFilterProps {
  value: IDiscountFilter;
  onChange: (value: IDiscountFilter) => void;
}

export function DiscountFilter({ value, onChange }: DiscountFilterProps) {
  const [filter, setFilter] = useState<IDiscountFilter>(
    value || DEFAULT_DISCOUNT_FILTER
  );
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleFilterChange = (newFilter: Partial<IDiscountFilter>) => {
    const updatedFilter = { ...filter, ...newFilter };
    setFilter(updatedFilter);
    onChange(updatedFilter);
  };

  const handleCustomCardDiscountRateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    // 빈 값이거나 유효한 숫자(소수점 포함)만 허용
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      // 빈 값인 경우 undefined로 설정, 그 외에는 숫자로 변환
      const numericValue = value === "" ? undefined : parseFloat(value);
      handleFilterChange({ customCardDiscountRate: numericValue });
    }
  };

  const containerClass = isMobile ? "space-y-6" : "grid grid-cols-2 gap-6";
  const sectionClass = isMobile ? "space-y-4" : "space-y-4";
  const optionClass = isMobile
    ? "bg-secondary/20 rounded-lg p-3"
    : "bg-secondary/10 hover:bg-secondary/20 transition-colors rounded-lg p-3";

  // 통신사 멤버십 RadioGroup의 grid 레이아웃을 조건부로 설정
  const carrierGridClass = isMobile
    ? "grid grid-cols-2 gap-2"
    : "grid grid-cols-1 gap-2";

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>할인 수단 선택</CardTitle>
        <CardDescription>
          사용 가능한 멤버십과 결제 방법을 선택하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={containerClass}>
          {/* 멤버십 섹션 */}
          <div className={sectionClass}>
            <h3 className="font-medium text-base">멤버십</h3>

            {/* 통신사 멤버십 */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                통신사 멤버십
              </Label>
              <RadioGroup
                value={filter.carrier}
                onValueChange={(value) =>
                  handleFilterChange({
                    carrier: value as "none" | "skt" | "kt" | "lg",
                  })
                }
                className={carrierGridClass}
              >
                <div className={`flex items-center space-x-2 ${optionClass}`}>
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none">없음</Label>
                </div>
                <div className={`flex items-center space-x-2 ${optionClass}`}>
                  <RadioGroupItem value="skt" id="skt" />
                  <Label htmlFor="skt">SKT (T멤버십)</Label>
                </div>
                <div className={`flex items-center space-x-2 ${optionClass}`}>
                  <RadioGroupItem value="kt" id="kt" />
                  <Label htmlFor="kt">KT (KT멤버십)</Label>
                </div>
                <div className={`flex items-center space-x-2 ${optionClass}`}>
                  <RadioGroupItem value="lg" id="lg" />
                  <Label htmlFor="lg">LG (U+멤버십)</Label>
                </div>
              </RadioGroup>
            </div>

            {/* 기타 멤버십 */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                기타 멤버십
              </Label>
              <div className="space-y-2">
                <div className={optionClass}>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="naver-membership"
                      checked={filter.useNaverMembership}
                      onCheckedChange={(checked: boolean | "indeterminate") =>
                        handleFilterChange({
                          useNaverMembership: checked === true,
                        })
                      }
                    />
                    <Label htmlFor="naver-membership">네이버 멤버십</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 결제 방법 섹션 */}
          <div className={sectionClass}>
            <h3 className="font-medium text-base">결제 방법</h3>

            {/* 간편결제 */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">간편결제</Label>
              <div className="grid grid-cols-1 gap-2">
                <div className={optionClass}>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="naver-pay"
                      checked={filter.useNaverPay}
                      onCheckedChange={(checked: boolean | "indeterminate") =>
                        handleFilterChange({ useNaverPay: checked === true })
                      }
                    />
                    <Label htmlFor="naver-pay">네이버페이</Label>
                  </div>
                </div>
                <div className={optionClass}>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="kakao-pay"
                      checked={filter.useKakaoPay}
                      onCheckedChange={(checked: boolean | "indeterminate") =>
                        handleFilterChange({ useKakaoPay: checked === true })
                      }
                    />
                    <Label htmlFor="kakao-pay">카카오페이</Label>
                  </div>
                </div>
                <div className={optionClass}>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="toss-pay"
                      checked={filter.useTossPay}
                      onCheckedChange={(checked: boolean | "indeterminate") =>
                        handleFilterChange({ useTossPay: checked === true })
                      }
                    />
                    <Label htmlFor="toss-pay">토스페이</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* 카드 할인 */}
            <div className="space-y-3">
              <div className={optionClass}>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="card-discount"
                    checked={filter.useCardDiscount}
                    onCheckedChange={(checked: boolean | "indeterminate") =>
                      handleFilterChange({
                        useCardDiscount: checked === true,
                        customCardDiscountRate: checked
                          ? filter.customCardDiscountRate || 5
                          : undefined,
                      })
                    }
                  />
                  <Label htmlFor="card-discount">할인 카드 사용</Label>
                </div>
              </div>

              {filter.useCardDiscount && (
                <div className="pl-6 space-y-1">
                  <Label htmlFor="discount-rate">할인률 (%)</Label>
                  <Input
                    id="discount-rate"
                    type="text"
                    min={0}
                    max={100}
                    value={filter.customCardDiscountRate?.toString() || ""}
                    onChange={handleCustomCardDiscountRateChange}
                    className="w-24"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
