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
  IStoreSpecificOptions,
} from "@/types/discountFilter";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export type { IDiscountFilter } from "@/types/discountFilter";

interface DiscountFilterProps {
  value: IDiscountFilter;
  onChange: (value: IDiscountFilter) => void;
  storeId?: string; // 매장 ID - GS25의 경우 'gs25'
}

/**
 * DiscountFilter 컴포넌트
 *
 * 사용자가 할인 수단을 선택할 수 있는 필터 컴포넌트입니다.
 * 통신사 멤버십, 네이버 멤버십, 간편결제, 카드 할인 등 다양한 할인 옵션을 선택할 수 있습니다.
 * 모바일과 데스크톱 레이아웃에 따라 UI가 최적화됩니다.
 */
export function DiscountFilter({
  value,
  onChange,
  storeId,
}: DiscountFilterProps) {
  // #region 상태 관리
  const [filter, setFilter] = useState<IDiscountFilter>(
    value || DEFAULT_DISCOUNT_FILTER
  );
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isGS25 = storeId === "gs25";
  const isCU = storeId === "2";
  // #endregion

  // #region 이벤트 핸들러
  /**
   * 필터 변경 핸들러
   * 사용자가 선택한 할인 옵션을 상태에 업데이트하고 부모 컴포넌트에 전달합니다.
   */
  const handleFilterChange = (newFilter: Partial<IDiscountFilter>) => {
    const updatedFilter = { ...filter, ...newFilter };
    setFilter(updatedFilter);
    onChange(updatedFilter);
  };

  /**
   * 매장별 특성 변경 핸들러
   * GS25 POP 로고 등 매장별 특성 옵션을 업데이트합니다.
   */
  const handleStoreSpecificOptionsChange = (
    storeId: string,
    options: Record<string, unknown>
  ) => {
    const currentOptions = filter.storeSpecificOptions || {};
    const updatedOptions: IStoreSpecificOptions = {
      ...currentOptions,
      [storeId]: {
        ...(currentOptions[storeId as keyof IStoreSpecificOptions] || {}),
        ...options,
      },
    };

    handleFilterChange({ storeSpecificOptions: updatedOptions });
  };

  /**
   * GS25 POP 로고 변경 핸들러
   * GS25의 POP 로고 유무 옵션을 처리합니다.
   */
  const handlePOPLogoChange = (checked: boolean | "indeterminate") => {
    handleStoreSpecificOptionsChange("gs25", { isPOPLogo: checked === true });
  };

  /**
   * CU 간편식 상품 변경 핸들러
   * CU의 KT 멤버십 할인을 위한 간편식 상품 여부를 처리합니다.
   */
  const handleConvenienceFoodChange = (checked: boolean | "indeterminate") => {
    handleStoreSpecificOptionsChange("2", {
      isConvenienceFood: checked === true,
    });
  };

  /**
   * 카드 할인율 변경 핸들러
   * 사용자가 입력한 카드 할인율을 처리합니다.
   */
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
  // #endregion

  // 반응형 UI 클래스 설정
  const containerClass = isMobile ? "space-y-6" : "grid grid-cols-2 gap-6";
  const sectionClass = isMobile ? "space-y-4" : "space-y-4";
  const optionClass = isMobile
    ? "bg-secondary/20 rounded-lg p-3"
    : "bg-secondary/10 hover:bg-secondary/20 transition-colors rounded-lg p-3";

  // 통신사 멤버십 RadioGroup의 grid 레이아웃을 조건부로 설정
  const carrierGridClass = isMobile
    ? "grid grid-cols-2 gap-2"
    : "grid grid-cols-1 gap-2";

  // GS25 POP 로고 체크 상태 가져오기
  const isPOPLogoChecked =
    filter.storeSpecificOptions?.gs25?.isPOPLogo || false;

  // CU 간편식 상품 체크 상태 가져오기
  const isConvenienceFoodChecked =
    filter.storeSpecificOptions?.["2"]?.isConvenienceFood || false;

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
          {/* #region 멤버십 섹션 */}
          <div className={sectionClass}>
            <h3 className="font-medium text-base">멤버십</h3>

            {/* 통신사 멤버십 선택 */}
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
                <div
                  className={`flex items-center space-x-2 ${optionClass} flex-col items-start`}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="kt" id="kt" />
                    <Label htmlFor="kt">KT (KT멤버십)</Label>
                  </div>
                  {isCU && filter.carrier === "kt" && (
                    <>
                      <p className="text-xs text-amber-600 mt-1 pl-6 w-full">
                        CU에서는 오전 5~9시에만, 간편식 상품만 할인 가능합니다.
                      </p>
                      <div className="ml-6 mt-2 flex items-center space-x-2">
                        <Checkbox
                          id="convenience-food"
                          checked={isConvenienceFoodChecked}
                          onCheckedChange={handleConvenienceFoodChange}
                        />
                        <Label htmlFor="convenience-food" className="text-sm">
                          간편식 상품 선택
                        </Label>
                      </div>
                    </>
                  )}
                </div>
                <div className={`flex items-center space-x-2 ${optionClass}`}>
                  <RadioGroupItem value="lg" id="lg" />
                  <Label htmlFor="lg">LG (U+멤버십)</Label>
                  {isCU && filter.carrier === "lg" && (
                    <p className="text-xs text-amber-600 mt-1 pl-6 w-full">
                      CU에서는 U+멤버십 할인이 제공되지 않습니다.
                    </p>
                  )}
                </div>
              </RadioGroup>
            </div>

            {/* 기타 멤버십 선택 */}
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

            {/* GS25 전용 옵션 - POP 로고 */}
            {isGS25 && (
              <div className="space-y-2 mt-4 border-t pt-4">
                <Label className="text-sm text-muted-foreground">
                  GS25 특별 옵션
                </Label>
                <div className="space-y-2">
                  <div className={optionClass}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="pop-logo"
                        checked={isPOPLogoChecked}
                        onCheckedChange={handlePOPLogoChange}
                      />
                      <Label htmlFor="pop-logo">POP 로고 상품</Label>
                    </div>
                    {isPOPLogoChecked && (
                      <p className="text-xs text-muted-foreground mt-1 pl-6">
                        POP 로고가 있는 상품은 네이버 멤버십 할인이 더 큽니다.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* #endregion */}

          {/* #region 결제 방법 섹션 */}
          <div className={sectionClass}>
            <h3 className="font-medium text-base">결제 방법</h3>

            {/* 간편결제 선택 */}
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

            {/* 카드 할인 선택 */}
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

              {/* 카드 할인률 입력 */}
              {filter.useCardDiscount && (
                <div className="pl-6 space-y-3">
                  <div className="space-y-1">
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

                  {/* 카드 할인 타입 선택 */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="card-discount-type"
                      className="text-sm text-muted-foreground"
                    >
                      할인 적용 방식
                    </Label>
                    <RadioGroup
                      id="card-discount-type"
                      value={filter.cardDiscountType}
                      onValueChange={(value) =>
                        handleFilterChange({
                          cardDiscountType: value as
                            | "instant"
                            | "point"
                            | "cashback",
                        })
                      }
                      className="grid grid-cols-1 gap-2"
                    >
                      <div
                        className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary/20`}
                      >
                        <RadioGroupItem value="instant" id="instant-discount" />
                        <Label htmlFor="instant-discount">즉시 할인</Label>
                      </div>
                      <div
                        className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary/20`}
                      >
                        <RadioGroupItem value="point" id="point-discount" />
                        <Label htmlFor="point-discount">적립</Label>
                      </div>
                      <div
                        className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary/20`}
                      >
                        <RadioGroupItem
                          value="cashback"
                          id="cashback-discount"
                        />
                        <Label htmlFor="cashback-discount">캐시백</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* #endregion */}
        </div>
      </CardContent>
    </Card>
  );
}
