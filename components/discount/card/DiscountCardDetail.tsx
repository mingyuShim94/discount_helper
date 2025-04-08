/**
 * DiscountCardDetail 컴포넌트
 *
 * 할인 계산 결과를 카드 형태로 표시하는 컴포넌트입니다.
 */

import React, { useMemo } from "react";
import { IDiscountCalculationResult } from "@/utils/discountCalculator";
import { Crown, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDiscountFormatter } from "@/hooks/useDiscountFormatter";
import DiscountCardItem from "./DiscountCardItem";

/**
 * 할인 카드 디테일 컴포넌트 Props
 */
export interface IDiscountCardDetailProps {
  discount: IDiscountCalculationResult;
  isBest?: boolean;
  storeId?: string;
  isExpanded?: boolean;
}

/**
 * 할인 카드 디테일 컴포넌트
 *
 * 할인 계산 결과를 카드 형태로 표시합니다.
 */
const DiscountCardDetail: React.FC<IDiscountCardDetailProps> = ({
  discount,
  isBest = false,
  storeId = "1",
  isExpanded = false,
}) => {
  // 할인 데이터 포맷팅 훅 사용
  const { discountComponents } = useDiscountFormatter(discount, storeId);

  // 할인율 메모이제이션
  const discountRateFormatted = useMemo(() => {
    return (discount.discountRate * 100).toFixed(1) + "%";
  }, [discount.discountRate]);

  // 금액 포맷팅 메모이제이션
  const formattedAmounts = useMemo(() => {
    return {
      totalBenefit: discount.totalBenefitAmount.toLocaleString(),
      original: discount.originalAmount.toLocaleString(),
      final: discount.finalAmount.toLocaleString(),
      perceived: discount.perceivedAmount.toLocaleString(),
    };
  }, [
    discount.totalBenefitAmount,
    discount.originalAmount,
    discount.finalAmount,
    discount.perceivedAmount,
  ]);

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden max-w-full ${
        isExpanded ? "opacity-100" : "opacity-90"
      }`}
      data-testid="discount-card-detail"
    >
      {/* 카드 헤더 */}
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="flex items-center">
          {isBest && (
            <Crown
              className="h-5 w-5 text-primary mr-2"
              aria-label="최적 할인 방법"
            />
          )}
          <h3 className={`font-bold ${isBest ? "text-primary" : ""} text-lg`}>
            {discount.method}
          </h3>
        </div>
        <div className="mt-1 text-sm text-gray-500">{discount.description}</div>
      </div>

      {/* 할인 금액 표시 */}
      <div className="px-4 py-3 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">할인 혜택</div>
            <div className="font-bold text-xl text-gray-800">
              {formattedAmounts.totalBenefit}원
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">할인율</div>
            <div className="font-medium text-md text-gray-800">
              {discountRateFormatted}
            </div>
          </div>
        </div>
      </div>

      {/* 할인 컴포넌트 리스트 */}
      <div className="px-4 py-3">
        <div className="text-sm font-medium mb-2">할인 상세 내역</div>
        <div className="space-y-2">
          {discountComponents.map((component, index) => (
            <DiscountCardItem
              key={`component-${index}`}
              name={component.name}
              description={component.description}
              amount={component.amount}
              type={component.type}
            />
          ))}
        </div>
      </div>

      {/* 결제 정보 */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">원래 금액</span>
          <span className="text-sm text-gray-800">
            {formattedAmounts.original}원
          </span>
        </div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">할인 적용가</span>
          <span className="text-sm font-medium text-gray-800">
            {formattedAmounts.final}원
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">최종 체감가</span>
          <span className="text-sm font-medium text-red-600">
            {formattedAmounts.perceived}원
          </span>
        </div>
      </div>

      {/* 참고 사항 */}
      {discount.note && (
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-xs text-gray-500 cursor-help">
                  <Info className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                  <span className="line-clamp-1">{discount.note}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">{discount.note}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default React.memo(DiscountCardDetail);
