/**
 * DiscountReceipt 컴포넌트
 *
 * 할인 계산 결과를 영수증 형태로 표시하는 컴포넌트입니다.
 */

import React, { useMemo } from "react";
import { IDiscountCalculationResult } from "@/utils/discountCalculator";
import { Crown } from "lucide-react";
import DiscountLineItem from "../common/DiscountLineItem";
import { useDiscountFormatter } from "@/hooks/useDiscountFormatter";
import DiscountReceiptItem from "./DiscountReceiptItem";

/**
 * 할인 영수증 컴포넌트 Props
 */
export interface IDiscountReceiptProps {
  discount: IDiscountCalculationResult;
  isBest?: boolean;
  storeId?: string;
}

/**
 * 할인 영수증 컴포넌트
 *
 * 할인 계산 결과를 영수증 형태로 표시합니다.
 */
const DiscountReceipt: React.FC<IDiscountReceiptProps> = ({
  discount,
  isBest = false,
  storeId = "1",
}) => {
  // 할인 데이터 포맷팅 훅 사용
  const { discountComponents } = useDiscountFormatter(discount, storeId);

  // 현재 날짜 포맷팅 메모이제이션
  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  }, []);

  // 바코드 ID 메모이제이션
  const barcodeId = useMemo(() => {
    return new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14);
  }, []);

  // 할인율 메모이제이션
  const discountRateFormatted = useMemo(() => {
    return (discount.discountRate * 100).toFixed(1) + "%";
  }, [discount.discountRate]);

  // 할인 유형별 컴포넌트 필터링 메모이제이션
  const instantComponents = useMemo(() => {
    return discountComponents.filter((comp) => comp.type === "instant");
  }, [discountComponents]);

  const pointComponents = useMemo(() => {
    return discountComponents.filter((comp) => comp.type === "point");
  }, [discountComponents]);

  const cashbackComponents = useMemo(() => {
    return discountComponents.filter((comp) => comp.type === "cashback");
  }, [discountComponents]);

  // 할인 유형별 표시 여부
  const hasPointItems = pointComponents.length > 0;
  const hasCashbackItems = cashbackComponents.length > 0;

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden max-w-lg mx-auto mb-4"
      data-testid="discount-receipt"
    >
      {/* 영수증 헤더 */}
      <div className="border-b border-dashed border-gray-300 bg-gray-50 px-6 py-3 text-center">
        <div className="font-bold text-xl mb-0.5">할인 영수증</div>
        <div className="text-xs text-gray-500">{formattedDate}</div>
      </div>

      {/* 상단 상점 정보 */}
      <div className="px-6 py-3 border-b border-dashed border-gray-300 text-center">
        <div className="flex items-center justify-center mb-2">
          {isBest && (
            <Crown
              className="h-6 w-6 text-primary mr-2"
              aria-label="최적 할인 방법"
            />
          )}
          <h3 className={`font-bold ${isBest ? "text-primary" : ""} text-xl`}>
            {isBest ? "최적 할인 방법" : "할인 방법"}
          </h3>
        </div>
        <div className="text-lg font-medium mb-2">{discount.method}</div>
      </div>

      {/* 총 할인 혜택 */}
      <div className="px-6 pt-3 pb-2">
        <div className="bg-purple-50 border-2 border-purple-200 p-3 rounded-md text-center mb-3">
          <div className="text-xs text-purple-700 mb-0.5 font-medium">
            총 할인 혜택
          </div>
          <div className="font-bold text-purple-700 text-2xl">
            {discount.totalBenefitAmount.toLocaleString()}원
          </div>
          <div className="text-xs text-purple-700 mt-0.5">
            할인율{" "}
            <span className="font-semibold">{discountRateFormatted}</span>
          </div>
        </div>
      </div>

      {/* 항목 목록 */}
      <div className="px-6 py-2">
        <div className="space-y-2">
          {/* 원래 금액 */}
          <DiscountLineItem
            label="원래 금액"
            amount={discount.originalAmount}
          />

          {/* 즉시 할인 항목들 */}
          {discount.instantDiscountAmount > 0 && (
            <>
              <DiscountLineItem
                label="즉시 할인"
                amount={-discount.instantDiscountAmount}
                type="discount"
              />

              <div className="space-y-2 ml-2 text-xs mt-1">
                {instantComponents.map((comp, idx) => (
                  <DiscountReceiptItem
                    key={`instant-${idx}`}
                    name={comp.name}
                    description={comp.description}
                    amount={comp.amount}
                    type={comp.type}
                  />
                ))}
              </div>
            </>
          )}

          {/* 실 결제액 */}
          <DiscountLineItem
            label="실 결제액"
            amount={discount.finalAmount}
            type="total"
          />

          {/* 적립 항목들 */}
          {hasPointItems && (
            <>
              <DiscountLineItem
                label="적립"
                amount={-discount.pointAmount}
                type="discount"
              />

              <div className="space-y-2 ml-2 text-xs mt-1">
                {pointComponents.map((comp, idx) => (
                  <DiscountReceiptItem
                    key={`point-${idx}`}
                    name={comp.name}
                    description={comp.description}
                    amount={comp.amount}
                    type={comp.type}
                  />
                ))}
              </div>
            </>
          )}

          {/* 캐시백 항목들 */}
          {hasCashbackItems && (
            <>
              <DiscountLineItem
                label="캐시백"
                amount={-discount.cashbackAmount}
                type="discount"
              />

              <div className="space-y-2 ml-2 text-xs mt-1">
                {cashbackComponents.map((comp, idx) => (
                  <DiscountReceiptItem
                    key={`cashback-${idx}`}
                    name={comp.name}
                    description={comp.description}
                    amount={comp.amount}
                    type={comp.type}
                  />
                ))}
              </div>
            </>
          )}

          {/* 체감가 */}
          <DiscountLineItem
            label="체감가"
            amount={discount.perceivedAmount}
            type="final"
          />
        </div>

        {/* 참고 사항 */}
        {discount.note && (
          <div className="text-xs text-gray-600 mt-2 pt-1.5 border-t border-dashed border-gray-300">
            <span className="font-medium">참고: </span>
            <span className="line-clamp-2 hover:line-clamp-none">
              {discount.note}
            </span>
          </div>
        )}
      </div>

      {/* 바코드 영역 */}
      <div className="px-6 py-2 text-center border-t border-dashed border-gray-300 mt-2">
        <div className="inline-block">
          <div className="h-8 w-48 mx-auto bg-gradient-to-r from-black via-black to-black bg-[length:100%_2px] bg-repeat-y"></div>
          <div className="mt-1 text-xs text-gray-500">{barcodeId}</div>
        </div>

        <div className="mt-1 text-xs text-gray-400">
          * 실제 결제시 금액은 변동될 수 있습니다
        </div>
      </div>

      {/* 점선 및 가위 아이콘 */}
      <div className="relative">
        <div className="absolute left-0 right-0 border-t-2 border-dashed border-gray-300"></div>
        <div className="absolute -top-3 -left-3 bg-white p-1 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DiscountReceipt);
