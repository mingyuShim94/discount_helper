"use client";
export const runtime = "edge";

import { useEffect, useState, use } from "react";
import { IStore } from "@/types/store";
import { STORES } from "@/lib/data/stores";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  DiscountFilter,
  IDiscountFilter,
} from "@/components/discount/DiscountFilter";
import {
  DiscountResult,
  AmountInput,
} from "@/components/discount/DiscountResult";
import { DEFAULT_DISCOUNT_FILTER } from "@/types/discountFilter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * StorePage 컴포넌트
 *
 * 특정 매장의 할인 정보를 표시하는 페이지 컴포넌트입니다.
 * 모바일과 데스크톱 환경에 따라 다른 레이아웃을 제공합니다.
 * 모바일에서는 단계별 UI를, 데스크톱에서는 그리드 레이아웃을 사용합니다.
 */
export default function StorePage({ params }: PageProps) {
  const { id } = use(params);

  // #region 상태 관리
  const [store, setStore] = useState<IStore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [discountFilter, setDiscountFilter] = useState<IDiscountFilter>(
    DEFAULT_DISCOUNT_FILTER
  );
  const [currentStep, setCurrentStep] = useState<number>(1);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // 금액 입력 관련 상태
  const [amountStr, setAmountStr] = useState<string>("5000");
  const [currentAmount, setCurrentAmount] = useState<number>(5000);
  const [hasPOPLogo, setHasPOPLogo] = useState<boolean>(false);
  // #endregion

  // #region 데이터 로딩
  /**
   * 매장 정보 로드 기능
   * 정적 데이터에서 매장 정보를 찾아 상태에 저장합니다.
   */
  useEffect(() => {
    const fetchStore = () => {
      try {
        setIsLoading(true);

        // 정적 데이터에서 매장 정보 가져오기
        const foundStore = STORES.find((store) => store.id === id);

        if (!foundStore) {
          throw new Error("매장 정보를 찾을 수 없습니다.");
        }

        setStore(foundStore);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("알 수 없는 오류가 발생했습니다.")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStore();
  }, [id]);
  // #endregion

  // #region 이벤트 핸들러
  /**
   * 할인 필터 변경 핸들러
   * 사용자가 선택한 할인 옵션을 상태에 업데이트합니다.
   */
  const handleFilterChange = (newFilter: IDiscountFilter) => {
    setDiscountFilter(newFilter);
  };

  /**
   * 단계 이동 핸들러 - 다음
   * 모바일 화면에서 다음 단계로 이동합니다.
   */
  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 2));
  };

  /**
   * 단계 이동 핸들러 - 이전
   * 모바일 화면에서 이전 단계로 이동합니다.
   */
  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  /**
   * 직접 금액 입력 핸들러
   * 사용자가 입력한 금액을 처리하고 상태에 저장합니다.
   * 수학 표현식도 계산할 수 있습니다.
   */
  const handleDirectAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountStr(value);

    if (!/^[\d+\-*/.]*$/.test(value)) return;

    let calculatedAmount = 0;
    if (value) {
      try {
        calculatedAmount = Math.floor(
          Function('"use strict";return (' + value + ")")()
        );
      } catch {
        calculatedAmount = parseInt(value);
      }

      if (!isNaN(calculatedAmount)) {
        setCurrentAmount(calculatedAmount >= 0 ? calculatedAmount : 0);
      }
    } else {
      setCurrentAmount(0);
    }
  };

  /**
   * 금액 입력 필드 포커스 핸들러
   */
  const handleAmountFocus = () => {
    setAmountStr("");
  };

  /**
   * POP 로고 체크박스 변경 핸들러
   */
  const handlePOPLogoChange = (checked: boolean) => {
    setHasPOPLogo(checked);
  };
  // #endregion

  // #region 로딩 및 에러 처리 UI
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage
          message={error?.message || "매장 정보를 로드할 수 없습니다."}
        />
      </div>
    );
  }
  // #endregion

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 페이지 헤더 */}
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold">{store.name} 할인 정보</h1>
      </div>

      {isMobile ? (
        // #region 모바일 레이아웃
        /**
         * 모바일 화면 레이아웃
         * 단계별로 사용자에게 UI를 보여줍니다.
         * 1단계: 할인 수단 선택
         * 2단계: 최적의 결제 방법
         */
        <div className="space-y-4">
          {/* 진행 상태 표시 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 1 ? "bg-primary text-white" : "bg-gray-200"
                }`}
              >
                1
              </div>
              <div className="h-1 flex-1 bg-gray-200">
                <div
                  className={`h-full bg-primary transition-all ${
                    currentStep === 2 ? "w-full" : "w-0"
                  }`}
                />
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 2 ? "bg-primary text-white" : "bg-gray-200"
                }`}
              >
                2
              </div>
            </div>
          </div>

          {/* 단계별 컨텐츠 */}
          <div className="min-h-[calc(100vh-16rem)] pb-20">
            {currentStep === 1 ? (
              /**
               * 1단계: 할인 수단 선택 화면
               */
              <>
                <h2 className="text-lg font-semibold mb-4">
                  1단계: 할인 수단 선택
                </h2>
                <DiscountFilter
                  value={discountFilter}
                  onChange={handleFilterChange}
                />
              </>
            ) : (
              /**
               * 2단계: 최적의 결제 방법 화면
               */
              <>
                <h2 className="text-lg font-semibold mb-4">
                  2단계: 최적의 결제 방법
                </h2>
                <div className="bg-white border rounded-md p-4 shadow-sm mb-4">
                  <h3 className="font-medium text-base mb-3">결제 금액 입력</h3>
                  <AmountInput
                    amountStr={amountStr}
                    currentAmount={currentAmount}
                    hasPOPLogo={hasPOPLogo}
                    handleDirectAmountChange={handleDirectAmountChange}
                    handleAmountFocus={handleAmountFocus}
                    handlePOPLogoChange={handlePOPLogoChange}
                    setCurrentAmount={setCurrentAmount}
                    setAmountStr={setAmountStr}
                    isMobile={isMobile}
                  />
                </div>
                <DiscountResult
                  filter={discountFilter}
                  storeId={id}
                  amount={currentAmount}
                  hasPOPLogo={hasPOPLogo}
                />
              </>
            )}
          </div>

          {/* 네비게이션 버튼 */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePrevStep}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                이전
              </Button>
            )}
            {currentStep < 2 && (
              <Button
                onClick={handleNextStep}
                className="flex items-center ml-auto"
              >
                다음
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        // #endregion
        // #region 데스크톱 레이아웃
        /**
         * 데스크톱 화면 레이아웃
         * 좌측에 필터 및 금액 입력, 우측에 결과를 그리드로 표시합니다.
         */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 좌측 패널: 할인 수단 선택 및 금액 입력 */}
          <div className="md:col-span-1 space-y-4">
            {/* 할인 수단 선택 */}
            <DiscountFilter
              value={discountFilter}
              onChange={handleFilterChange}
            />

            {/* 금액 입력 UI - 데스크톱에서만 표시 */}
            <div className="bg-white border rounded-md p-4 shadow-sm">
              <h3 className="font-medium text-base mb-3">결제 금액 입력</h3>
              <AmountInput
                amountStr={amountStr}
                currentAmount={currentAmount}
                hasPOPLogo={hasPOPLogo}
                handleDirectAmountChange={handleDirectAmountChange}
                handleAmountFocus={handleAmountFocus}
                handlePOPLogoChange={handlePOPLogoChange}
                setCurrentAmount={setCurrentAmount}
                setAmountStr={setAmountStr}
                isMobile={isMobile}
              />
            </div>
          </div>

          {/* 우측 패널: 할인 결과 표시 */}
          <div className="md:col-span-2">
            <DiscountResult
              filter={discountFilter}
              storeId={id}
              amount={currentAmount}
              hasPOPLogo={hasPOPLogo}
            />
          </div>
        </div>
        // #endregion
      )}
    </div>
  );
}
