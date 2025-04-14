/**
 * DiscountResult 컴포넌트
 *
 * 사용자가 입력한 금액과 선택한 할인 옵션에 따라 최적의 할인 방법을 계산하고 표시하는 컴포넌트입니다.
 * 모바일과 데스크톱 환경에 따라 다른 UI를 제공하며, 할인 정보를 직관적으로 표시합니다.
 */

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { IDiscountFilter } from "@/types/discountFilter";
import {
  calculateOptimalDiscounts,
  IDiscountCalculationResult,
} from "@/utils/discountCalculator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HelpCircle,
  Gift,
  Zap,
  Crown,
  ListFilter,
  Info,
  BadgePercent,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DiscountReceipt,
  DiscountCardDetail,
} from "@/components/discount/DiscountDetail";

/**
 * isWeekend 유틸리티 함수
 *
 * 현재 한국 시간 기준 요일이 금/토/일인지 확인합니다.
 * 네이버페이 주말 캐시백 혜택 표시 여부를 결정하는 데 사용됩니다.
 *
 * @returns {boolean} 금/토/일이면 true, 아니면 false
 */
function isWeekend(): boolean {
  const now = new Date();
  const day = now.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
  return day === 0 || day === 5 || day === 6;
}

/**
 * DiscountResult 컴포넌트의 Props 인터페이스
 * @interface DiscountResultProps
 * @property {number} [amount] - 계산할 금액 (기본값: 0)
 * @property {IDiscountFilter} [filter] - 할인 필터 옵션
 * @property {string} [storeId] - 매장 ID
 * @property {boolean} [hasPOPLogo] - POP 로고 존재 여부
 */
interface DiscountResultProps {
  amount?: number;
  filter?: IDiscountFilter;
  storeId?: string;
  hasPOPLogo?: boolean;
}

/**
 * 계산 히스토리 항목 인터페이스
 * @interface ICalculationItem
 * @property {string} id - 항목의 고유 식별자
 * @property {number} amount - 항목의 금액
 * @property {string} description - 항목에 대한 설명
 */

/**
 * AmountInput 컴포넌트의 Props 인터페이스
 */
interface AmountInputProps {
  amountStr: string;
  currentAmount: number;
  hasPOPLogo: boolean;
  handleDirectAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAmountFocus: () => void;
  handlePOPLogoChange: (checked: boolean) => void;
  setCurrentAmount: React.Dispatch<React.SetStateAction<number>>;
  setAmountStr: React.Dispatch<React.SetStateAction<string>>;
  isMobile: boolean;
}

/**
 * AmountInput 컴포넌트
 *
 * 사용자가 결제 금액을 입력하고 POP 로고 여부를 선택할 수 있는 UI 컴포넌트입니다.
 * 수학 표현식 계산 기능을 지원하며, 금액 입력 버튼과 초기화 기능을 제공합니다.
 * 모바일과 데스크톱 레이아웃에 따라 UI가 최적화됩니다.
 */
export function AmountInput({
  amountStr,
  currentAmount,
  hasPOPLogo,
  handleDirectAmountChange,
  handleAmountFocus,
  handlePOPLogoChange,
  setCurrentAmount,
  setAmountStr,
  isMobile,
}: AmountInputProps) {
  return (
    <div className="mt-4">
      {/* 금액 입력 필드 */}
      <div className={`flex ${isMobile ? "flex-col" : "items-center"} gap-2`}>
        <Label className={isMobile ? "mb-1" : "mr-2"}>총 금액:</Label>
        <div className="flex-1 flex items-center">
          <Input
            type="text"
            value={amountStr}
            onChange={handleDirectAmountChange}
            onFocus={handleAmountFocus}
            placeholder="예상결제 금액을 입력해주세요"
            className="w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (amountStr) {
                  let calculatedAmount = 0;
                  try {
                    calculatedAmount = Math.floor(
                      Function('"use strict";return (' + amountStr + ")")()
                    );
                  } catch {
                    calculatedAmount = parseInt(amountStr);
                  }
                  if (!isNaN(calculatedAmount)) {
                    setCurrentAmount(
                      calculatedAmount >= 0 ? calculatedAmount : 0
                    );
                  }
                }
              }
            }}
          />
          <span className="ml-2 mr-2">원</span>
        </div>
      </div>

      {/* 금액 조절 버튼 영역 */}
      <div className={`flex gap-2 ${isMobile ? "mt-2" : "mt-3"}`}>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const newAmount = currentAmount + 1000;
            setCurrentAmount(newAmount);
            setAmountStr(newAmount.toString());
          }}
        >
          +1,000원
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const newAmount = currentAmount + 100;
            setCurrentAmount(newAmount);
            setAmountStr(newAmount.toString());
          }}
        >
          +100원
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-red-500 hover:text-red-600"
          onClick={() => {
            setCurrentAmount(0);
            setAmountStr("");
          }}
        >
          초기화
        </Button>
      </div>

      {/* POP 로고 체크박스 영역 */}
      <div
        className={`flex items-center space-x-2 ${isMobile ? "mt-4" : "mt-2"}`}
      >
        <Checkbox
          id="popLogo"
          checked={hasPOPLogo}
          onCheckedChange={(checked: boolean) => handlePOPLogoChange(checked)}
        />
        <Label htmlFor="popLogo" className="text-sm">
          POP 로고 있는 상품
        </Label>
        {isMobile && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 ml-1 text-gray-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[200px]">
                  POP 로고가 있는 상품은 추가 할인이 적용됩니다.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}

export function DiscountResult({
  amount = 0,
  filter = {
    carrier: "none",
    useNaverMembership: false,
    useNaverPay: false,
    useKakaoPay: false,
    useTossPay: false,
    useCardDiscount: false,
    cardDiscountType: "instant",
  },
  storeId = "1", // 기본값은 GS25
  hasPOPLogo = false,
}: DiscountResultProps) {
  // #region 상태 관리
  /**
   * 금액 관련 상태
   * currentAmount: 실제 계산에 사용되는 숫자 금액
   * hasPOPLogoState: POP 로고 존재 여부 (추가 할인 적용)
   */
  const [currentAmount, setCurrentAmount] = useState<number>(amount || 5000);
  const [hasPOPLogoState, setHasPOPLogoState] = useState<boolean>(hasPOPLogo);

  /**
   * UI 상태 관리
   * expandedCards: 각 할인 방법 카드의 확장/축소 상태를 저장하는 객체
   * isMobile: 현재 화면이 모바일 크기인지 여부
   * selectedDiscount: 사용자가 선택한 할인 방법 (테이블 행 클릭)
   */
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedDiscount, setSelectedDiscount] =
    useState<IDiscountCalculationResult | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  // #endregion

  // #region 초기화 및 상태 업데이트
  /**
   * 외부에서 전달된 amount가 변경될 때 currentAmount 업데이트
   */
  useEffect(() => {
    if (amount > 0) {
      setCurrentAmount(amount);
    }
  }, [amount]);

  /**
   * 외부에서 전달된 hasPOPLogo가 변경될 때 내부 상태 업데이트
   */
  useEffect(() => {
    setHasPOPLogoState(hasPOPLogo);
  }, [hasPOPLogo]);

  /**
   * 필터 변경 시 드롭다운 초기화 효과
   * 필터가 변경될 때마다 모든 카드의 드롭다운 상태를 닫힘으로 초기화합니다.
   */
  useEffect(() => {
    const initialExpandedState: Record<string, boolean> = {};
    discountResults.forEach((discount) => {
      initialExpandedState[discount.method] = false;
    });
    setExpandedCards(initialExpandedState);
  }, [filter]);
  // #endregion

  // #region 이벤트 핸들러
  /**
   * 카드 토글 핸들러
   * 특정 할인 방법 카드의 드롭다운 상태를 전환합니다.
   *
   * @param method 토글할 카드의 할인 방법 이름
   */
  const handleToggleCard = (method: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [method]: !prev[method],
    }));
  };

  /**
   * 할인 방법 선택 핸들러
   * 테이블 행 클릭 시 해당 할인 방법을 선택 상태로 설정합니다.
   *
   * @param discount 선택된 할인 방법
   */
  const handleSelectDiscount = (discount: IDiscountCalculationResult) => {
    setSelectedDiscount(discount);
  };
  // #endregion

  // #region 할인 계산 및 데이터 처리
  /**
   * 할인 결과 계산
   * 현재 금액, 할인 필터, POP 로고 여부, 매장 ID를 기반으로 할인 결과를 계산합니다.
   * 할인은 '즉시할인', '적립', '캐시백'으로 구분됩니다.
   */
  const discountResults = calculateOptimalDiscounts(
    currentAmount,
    filter,
    hasPOPLogoState,
    storeId
  );

  /**
   * 주말 캐시백 메시지 표시 여부
   * 현재 요일이 금/토/일이고 네이버페이 옵션이 선택된 경우에만 표시합니다.
   */
  const showWeekendMessage = isWeekend() && filter.useNaverPay;

  /**
   * 최적 할인 방법
   * 할인 방법 중 순위가 가장 높은(rank가 가장 낮은) 할인 방법을 선택합니다.
   */
  const bestDiscount =
    discountResults.length > 0
      ? discountResults.sort((a, b) => a.rank - b.rank)[0]
      : null;
  // #endregion

  return (
    <div className="space-y-4">
      {/* #region 주말 캐시백 알림 메시지 */}
      {showWeekendMessage && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded relative mb-4">
          <p className="font-medium">네이버페이 금/토/일 캐시백 이벤트!</p>
          <p className="text-sm">
            오늘은{" "}
            {(() => {
              const now = new Date();
              const day = now.getDay();

              const dayMap: { [key: number]: string } = {
                0: "일요일",
                1: "월요일",
                2: "화요일",
                3: "수요일",
                4: "목요일",
                5: "금요일",
                6: "토요일",
              };

              return dayMap[day] || "평일";
            })()}
            입니다! 네이버페이로 2,000원 이상 결제 시 500원 캐시백이 적용됩니다.
            (단, 이벤트 사전 신청 필요)
          </p>
          <a
            href="https://campaign2.naver.com/npay/fridays2/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            이벤트 신청하기 →
          </a>
        </div>
      )}
      {/* #endregion */}

      {/* #region 메인 할인 결과 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>최적의 결제 방법</span>
            {bestDiscount && (
              <div className="text-sm font-normal bg-primary/10 text-primary py-1 px-3 rounded-full flex items-center">
                <span className="mr-2">최대 혜택</span>
                <span className="font-bold">
                  {bestDiscount.totalBenefitAmount.toLocaleString()}원
                </span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* 입력 금액이 0인 경우 안내 메시지 */}
          {currentAmount === 0 ? (
            <div className="text-center py-4">금액을 입력해 주세요</div>
          ) : discountResults.length === 0 ? (
            <div className="text-center py-4">적용 가능한 할인이 없습니다</div>
          ) : (
            <>
              {/* #region 모바일 화면 레이아웃 - 탭 형태로 표시 */}
              {isMobile ? (
                <Tabs defaultValue="optimal" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="optimal" className="flex items-center">
                      <BadgePercent className="h-4 w-4 mr-1" />
                      <span>최적 할인</span>
                    </TabsTrigger>
                    <TabsTrigger value="all-list" className="flex items-center">
                      <ListFilter className="h-4 w-4 mr-1" />
                      <span>전체 목록</span>
                    </TabsTrigger>
                    <TabsTrigger value="terms" className="flex items-center">
                      <Info className="h-4 w-4 mr-1" />
                      <span>용어 설명</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* 최적 할인 탭 컨텐츠 */}
                  <TabsContent value="optimal" className="mt-0">
                    {bestDiscount && (
                      <DiscountReceipt
                        discount={bestDiscount}
                        isBest={true}
                        storeId={storeId}
                      />
                    )}
                  </TabsContent>

                  {/* 전체 목록 탭 컨텐츠 */}
                  <TabsContent value="all-list" className="mt-0">
                    <div className="space-y-4">
                      {discountResults
                        .sort(
                          (a, b) => b.totalBenefitAmount - a.totalBenefitAmount
                        )
                        .map((discount) => (
                          <Card
                            key={discount.method}
                            className={
                              bestDiscount &&
                              discount.method === bestDiscount.method
                                ? "border-primary border-2 shadow-md relative"
                                : "border-border relative"
                            }
                          >
                            {bestDiscount &&
                              discount.method === bestDiscount.method && (
                                <div className="absolute top-2 right-2 text-primary bg-primary/10 rounded-full p-1">
                                  <Crown className="h-4 w-4" />
                                </div>
                              )}
                            <CardHeader
                              className={`py-3 ${
                                bestDiscount &&
                                discount.method === bestDiscount.method
                                  ? "bg-primary/5"
                                  : ""
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                  <span
                                    className={
                                      bestDiscount &&
                                      discount.method === bestDiscount.method
                                        ? "font-bold text-primary text-lg whitespace-normal block"
                                        : "text-lg whitespace-normal block"
                                    }
                                  >
                                    {discount.method}
                                  </span>
                                  {discount.note && (
                                    <p className="text-xs text-gray-500 mt-1 break-words max-w-[200px] line-clamp-2 hover:line-clamp-none">
                                      {discount.note}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col items-end">
                                  <div className="flex items-center bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full mb-1">
                                    <span className="text-xs font-semibold whitespace-nowrap mr-1">
                                      총 혜택:
                                    </span>
                                    <span className="font-bold text-base whitespace-nowrap">
                                      {discount.totalBenefitAmount.toLocaleString()}
                                      원
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-xs mr-1 whitespace-nowrap">
                                      할인율:
                                    </span>
                                    <span className="font-bold text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full whitespace-nowrap">
                                      {(discount.discountRate * 100).toFixed(1)}
                                      %
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* 혜택 자세히 보기 드롭다운 바 */}
                              <div
                                className="flex justify-between items-center mt-3 pt-2 border-t border-dashed cursor-pointer hover:bg-gray-50 rounded px-1"
                                onClick={() =>
                                  handleToggleCard(discount.method)
                                }
                              >
                                <span className="text-sm text-gray-600 font-medium">
                                  {expandedCards[discount.method]
                                    ? "혜택 접기"
                                    : "혜택 자세히 보기"}
                                </span>
                                {expandedCards[discount.method] ? (
                                  <ChevronUp className="h-5 w-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-500" />
                                )}
                              </div>
                            </CardHeader>

                            <CardContent className="pt-0 pb-3 overflow-hidden">
                              <div
                                className={`transition-all duration-300 ease-in-out ${
                                  expandedCards[discount.method]
                                    ? "max-h-[2000px] opacity-100"
                                    : "max-h-0 opacity-0"
                                }`}
                              >
                                <DiscountCardDetail
                                  discount={discount}
                                  isExpanded={expandedCards[discount.method]}
                                  storeId={storeId}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>

                  {/* 용어 설명 탭 컨텐츠 */}
                  <TabsContent value="terms" className="mt-0">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="p-3 border rounded-md bg-purple-50">
                            <h3 className="font-bold text-purple-800 flex items-center mb-2">
                              <BadgePercent className="h-4 w-4 mr-1" />총 할인
                              혜택
                            </h3>
                            <p className="text-sm">
                              즉시 할인과 적립 및 캐시백을 모두 합친 총 혜택
                              금액입니다. 카드 할인, 통신사 멤버십 할인, 포인트
                              적립, 캐시백 등이 모두 포함됩니다.
                            </p>
                          </div>

                          <div className="p-3 border rounded-md bg-green-50">
                            <h3 className="font-bold text-green-800 flex items-center mb-2">
                              <Zap className="h-4 w-4 mr-1" />
                              즉시 할인
                            </h3>
                            <p className="text-sm">
                              결제 시점에 바로 적용되는 할인입니다. 카드 즉시
                              할인, 통신사 멤버십 할인 등이 여기에 포함됩니다.
                            </p>
                          </div>

                          <div className="p-3 border rounded-md bg-blue-50">
                            <h3 className="font-bold text-blue-800 flex items-center mb-2">
                              <Gift className="h-4 w-4 mr-1" />
                              적립
                            </h3>
                            <p className="text-sm">
                              실제 결제 시점에는 할인되지 않고 나중에 포인트로
                              받게 되는 혜택입니다. 네이버 멤버십 포인트 적립,
                              카드 포인트 적립 등이 여기에 포함됩니다. 적립된
                              포인트는 추후 사용 가능합니다.
                            </p>
                          </div>

                          <div className="p-3 border rounded-md bg-yellow-50">
                            <h3 className="font-bold text-yellow-800 flex items-center mb-2">
                              <Gift className="h-4 w-4 mr-1" />
                              캐시백
                            </h3>
                            <p className="text-sm">
                              결제 후 현금성 자산으로 환급되는 혜택입니다.
                              네이버페이 주말 캐시백, 카드 캐시백 등이 여기에
                              포함됩니다. 캐시백은 보통 결제 후 일정 기간 내에
                              자동으로 지급됩니다.
                            </p>
                          </div>

                          <div className="p-3 border rounded-md bg-red-50">
                            <h3 className="font-bold text-red-800 flex items-center mb-2">
                              <Loader2 className="h-4 w-4 mr-1" />
                              체감가란?
                            </h3>
                            <p className="text-sm">
                              체감가는 원가에서 즉시할인, 적립, 캐시백을 모두
                              반영한 실질적인 소비자 체감 비용입니다. 현장에서
                              바로 할인받는 금액과 나중에 적립이나 캐시백으로
                              돌려받는 혜택을 모두 고려한 최종 부담 비용을
                              의미합니다.
                            </p>
                          </div>

                          <div className="p-3 border rounded-md">
                            <h3 className="font-bold flex items-center mb-2">
                              <Info className="h-4 w-4 mr-1" />실 결제액
                            </h3>
                            <p className="text-sm">
                              원래 금액에서 즉시 할인만 차감한 실제 결제
                              금액입니다. 적립 혜택과 캐시백은 나중에 받게
                              되므로 실 결제액에는 반영되지 않습니다.
                            </p>
                          </div>

                          {showWeekendMessage && (
                            <div className="p-3 border rounded-md bg-yellow-50">
                              <h3 className="font-bold text-yellow-800 flex items-center mb-2">
                                네이버페이 주말 캐시백
                              </h3>
                              <p className="text-sm">
                                금/토/일에 네이버페이로 2,000원 이상 결제 시
                                500원 캐시백이 적용됩니다. 이 혜택을 받으려면
                                네이버페이 이벤트 사전 신청이 필요합니다.
                              </p>
                              <a
                                href="https://campaign2.naver.com/npay/fridays2/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                이벤트 신청하기 →
                              </a>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                <>
                  {/* 데스크톱 UI: 할인 영수증과 할인 테이블을 나란히 배치 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* 좌측: 할인 영수증 */}
                    <div className="lg:sticky lg:top-4 lg:self-start">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">
                          {selectedDiscount
                            ? "선택된 할인 방법"
                            : "최적 할인 방법"}
                        </h3>
                        {selectedDiscount && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDiscount(null)}
                          >
                            최적 할인으로 돌아가기
                          </Button>
                        )}
                      </div>

                      {/* 영수증 */}
                      {selectedDiscount ? (
                        <DiscountReceipt
                          discount={selectedDiscount}
                          isBest={
                            selectedDiscount.method === bestDiscount?.method
                          }
                          storeId={storeId}
                        />
                      ) : (
                        bestDiscount && (
                          <DiscountReceipt
                            discount={bestDiscount}
                            isBest={true}
                            storeId={storeId}
                          />
                        )
                      )}
                    </div>

                    {/* 우측: 할인 테이블 */}
                    <div className="rounded-md border">
                      <div className="p-3 bg-gray-50 border-b">
                        <h3 className="font-medium">할인 방법 비교</h3>
                        <p className="text-xs text-gray-500">
                          원하는 할인 방법을 클릭하여 상세 정보를 확인하세요
                        </p>
                      </div>
                      <Table>
                        {/* 테이블 헤더 */}
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right bg-purple-50 w-[100px]">
                              총 혜택
                            </TableHead>
                            <TableHead className="text-right bg-red-50 w-[100px]">
                              체감가
                            </TableHead>
                            <TableHead>할인 방법</TableHead>
                            <TableHead className="text-right">혜택율</TableHead>
                            <TableHead className="text-right bg-green-50 w-[100px]">
                              즉시할인
                            </TableHead>
                            <TableHead className="text-right bg-blue-50 w-[100px]">
                              적립
                            </TableHead>
                            <TableHead className="text-right bg-yellow-50 w-[100px]">
                              캐시백
                            </TableHead>
                            <TableHead className="text-right w-[100px]">
                              결제 금액
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* 할인 방법 목록 행 */}
                          {discountResults
                            .sort(
                              (a, b) =>
                                b.totalBenefitAmount - a.totalBenefitAmount
                            )
                            .map((discount) => (
                              <TableRow
                                key={discount.method}
                                className={`
                                  ${
                                    bestDiscount &&
                                    discount.method === bestDiscount.method
                                      ? "bg-primary/5 border-l-4 border-l-primary"
                                      : ""
                                  }
                                  ${
                                    selectedDiscount &&
                                    discount.method === selectedDiscount.method
                                      ? "bg-blue-50 hover:bg-blue-100"
                                      : "hover:bg-gray-50"
                                  }
                                  cursor-pointer
                                `}
                                onClick={() => handleSelectDiscount(discount)}
                              >
                                <TableCell className="text-right font-bold text-purple-700 bg-purple-50">
                                  <div className="text-lg">
                                    {discount.totalBenefitAmount.toLocaleString()}
                                    원
                                  </div>
                                  <div className="text-xs text-gray-600 font-normal">
                                    전체 혜택
                                  </div>
                                </TableCell>
                                <TableCell className="text-right font-bold text-red-500 bg-red-50">
                                  {discount.perceivedAmount.toLocaleString()}원
                                  <div className="text-xs text-gray-500 font-normal">
                                    체감 금액
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                  <div className="space-y-2">
                                    {bestDiscount &&
                                      discount.method ===
                                        bestDiscount.method && (
                                        <div className="flex items-center mb-1 text-primary">
                                          <Crown className="h-4 w-4 mr-1" />
                                          <span className="text-xs font-medium">
                                            최적 할인
                                          </span>
                                        </div>
                                      )}
                                    <span
                                      className={
                                        bestDiscount &&
                                        discount.method === bestDiscount.method
                                          ? "font-bold text-primary text-lg whitespace-normal block"
                                          : "text-lg whitespace-normal block"
                                      }
                                    >
                                      {discount.method}
                                    </span>
                                    {discount.note && (
                                      <p className="text-xs text-gray-500 mt-1 break-words max-w-[200px] line-clamp-2 hover:line-clamp-none">
                                        {discount.note}
                                      </p>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    {(discount.discountRate * 100).toFixed(1)}
                                  </span>
                                </TableCell>
                                <TableCell
                                  className={
                                    discount.instantDiscountAmount > 0
                                      ? "text-right text-green-600 font-bold bg-green-50"
                                      : "text-right text-gray-500 bg-green-50"
                                  }
                                >
                                  {discount.instantDiscountAmount > 0
                                    ? `-${discount.instantDiscountAmount.toLocaleString()}원`
                                    : "0원"}
                                </TableCell>
                                <TableCell
                                  className={
                                    discount.pointAmount > 0
                                      ? "text-right text-blue-600 font-bold bg-blue-50"
                                      : "text-right text-gray-500 bg-blue-50"
                                  }
                                >
                                  {discount.pointAmount > 0
                                    ? `-${discount.pointAmount.toLocaleString()}원`
                                    : "0원"}
                                </TableCell>
                                <TableCell
                                  className={
                                    discount.cashbackAmount > 0
                                      ? "text-right text-amber-600 font-bold bg-yellow-50"
                                      : "text-right text-gray-500 bg-yellow-50"
                                  }
                                >
                                  {discount.cashbackAmount > 0
                                    ? `-${discount.cashbackAmount.toLocaleString()}원`
                                    : "0원"}
                                </TableCell>
                                <TableCell className="text-right font-bold">
                                  {discount.finalAmount.toLocaleString()}원
                                  <div className="text-xs text-gray-500 font-normal">
                                    실제 결제액
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
