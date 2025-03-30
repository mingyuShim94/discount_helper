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
import { DiscountResult } from "@/components/discount/DiscountResult";
import { DEFAULT_DISCOUNT_FILTER } from "@/types/discountFilter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StorePage({ params }: PageProps) {
  const { id } = use(params);
  const [store, setStore] = useState<IStore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [discountFilter, setDiscountFilter] = useState<IDiscountFilter>(
    DEFAULT_DISCOUNT_FILTER
  );
  const [currentStep, setCurrentStep] = useState<number>(1);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // 매장 정보 로드
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

  // 할인 필터 변경 핸들러
  const handleFilterChange = (newFilter: IDiscountFilter) => {
    setDiscountFilter(newFilter);
  };

  // 다음 단계로 이동
  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 2));
  };

  // 이전 단계로 이동
  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold">{store.name} 할인 정보</h1>
      </div>

      {isMobile ? (
        // 모바일 화면: 단계별 표시
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
              <>
                <h2 className="text-lg font-semibold mb-4">
                  2단계: 최적의 결제 방법
                </h2>
                <DiscountResult filter={discountFilter} />
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
        // 데스크톱 화면: 기존 레이아웃 유지
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <DiscountFilter
              value={discountFilter}
              onChange={handleFilterChange}
            />
          </div>
          <div className="md:col-span-2">
            <DiscountResult filter={discountFilter} />
          </div>
        </div>
      )}
    </div>
  );
}
