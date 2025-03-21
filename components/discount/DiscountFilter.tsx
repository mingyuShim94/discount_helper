"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export type { IDiscountFilter } from "@/types/discountFilter";

interface DiscountFilterProps {
  value: IDiscountFilter;
  onChange: (value: IDiscountFilter) => void;
}

export function DiscountFilter({ value, onChange }: DiscountFilterProps) {
  const [filter, setFilter] = useState<IDiscountFilter>(
    value || DEFAULT_DISCOUNT_FILTER
  );

  const handleFilterChange = (newFilter: Partial<IDiscountFilter>) => {
    const updatedFilter = { ...filter, ...newFilter };
    setFilter(updatedFilter);
    onChange(updatedFilter);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>할인 수단 선택</CardTitle>
        <CardDescription>
          사용 가능한 멤버십과 결제 방법을 선택하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="membership" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="membership">멤버십</TabsTrigger>
            <TabsTrigger value="payment">결제 방법</TabsTrigger>
          </TabsList>

          {/* 멤버십 선택 탭 */}
          <TabsContent value="membership">
            <div className="space-y-6">
              {/* 통신사 멤버십 */}
              <div className="space-y-2">
                <Label className="text-base font-medium">통신사 멤버십</Label>
                <RadioGroup
                  value={filter.carrier}
                  onValueChange={(value) =>
                    handleFilterChange({
                      carrier: value as "none" | "skt" | "kt" | "lg",
                    })
                  }
                  className="grid grid-cols-2 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="none" />
                    <Label htmlFor="none">없음</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="skt" id="skt" />
                    <Label htmlFor="skt">SKT (T멤버십)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="kt" id="kt" />
                    <Label htmlFor="kt">KT (KT멤버십)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lg" id="lg" />
                    <Label htmlFor="lg">LG (U+멤버십)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* 네이버 멤버십 */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="naver-membership"
                  checked={filter.useNaverMembership}
                  onCheckedChange={(checked: boolean | "indeterminate") =>
                    handleFilterChange({ useNaverMembership: checked === true })
                  }
                />
                <Label htmlFor="naver-membership">네이버 멤버십</Label>
              </div>
            </div>
          </TabsContent>

          {/* 결제 방법 선택 탭 */}
          <TabsContent value="payment">
            <div className="space-y-6">
              {/* 간편결제 */}
              <div className="space-y-2">
                <Label className="text-base font-medium">간편결제</Label>
                <div className="grid grid-cols-1 gap-2">
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

              {/* 카드 할인 */}
              <div className="space-y-3">
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

                {filter.useCardDiscount && (
                  <div className="pl-6 space-y-1">
                    <Label htmlFor="discount-rate">할인률 (%)</Label>
                    <Input
                      id="discount-rate"
                      type="number"
                      min={0}
                      max={100}
                      value={filter.customCardDiscountRate || 5}
                      onChange={(e) =>
                        handleFilterChange({
                          customCardDiscountRate:
                            parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-24"
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
