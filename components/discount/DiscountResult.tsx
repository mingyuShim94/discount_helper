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
import { calculateOptimalDiscounts } from "@/utils/discountCalculator";
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
  Plus,
  X,
  Trash2,
  ChevronDown,
  ChevronUp,
  Crown,
  ListFilter,
  Info,
  BadgePercent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * 현재 한국 시간 기준 요일이 금/토/일인지 확인합니다.
 * @returns 금/토/일이면 true, 아니면 false
 */
function isWeekend(): boolean {
  // 한국 시간(KST)으로 현재 날짜 가져오기
  const now = new Date();
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9 시간

  const day = kstNow.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일

  // 금요일(5), 토요일(6), 일요일(0)인 경우 true 반환
  return day === 0 || day === 5 || day === 6;
}

interface DiscountResultProps {
  amount?: number;
  filter?: IDiscountFilter;
}

// 계산 히스토리 항목 인터페이스
interface ICalculationItem {
  id: string;
  amount: number;
  description: string;
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
  },
}: DiscountResultProps) {
  const [amountStr, setAmountStr] = useState<string>("");
  const [currentAmount, setCurrentAmount] = useState<number>(amount || 5000);
  const [hasPOPLogo, setHasPOPLogo] = useState<boolean>(false);

  // 계산 히스토리 관련 상태
  const [calculationItems, setCalculationItems] = useState<ICalculationItem[]>(
    []
  );
  const [itemAmountStr, setItemAmountStr] = useState<string>("");
  const [itemDescription, setItemDescription] = useState<string>("");
  const [isCalculatorExpanded, setIsCalculatorExpanded] =
    useState<boolean>(false);

  // amountStr 초기화를 위한 useEffect 추가
  useEffect(() => {
    // 컴포넌트 마운트 시 현재 금액으로 amountStr을 초기화
    if (amountStr === "" && currentAmount > 0) {
      setAmountStr(currentAmount.toString());
    }
  }, [amountStr, currentAmount]);

  // 카드 확장/축소 관련 상태
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
    {}
  );
  const isMobile = useMediaQuery("(max-width: 768px)");

  // 카드 확장/축소 토글 함수
  const toggleCardExpansion = (method: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [method]: !prev[method],
    }));
  };

  const handleItemAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 숫자와 기본 수학 연산자만 허용
    if (/^[\d+\-*/.]*$/.test(value)) {
      setItemAmountStr(value);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemDescription(e.target.value);
  };

  const addCalculationItem = () => {
    if (!itemAmountStr) return;

    let amount = 0;

    try {
      // 수학 표현식 계산 시도
      amount = Math.floor(
        Function('"use strict";return (' + itemAmountStr + ")")()
      );
    } catch {
      // 표현식 계산 실패 시 단순 parseInt 사용
      amount = parseInt(itemAmountStr);
    }

    // 유효한 금액인 경우만 추가
    if (!isNaN(amount) && amount > 0) {
      const newItem: ICalculationItem = {
        id: Date.now().toString(),
        amount: amount,
        description: itemDescription || `항목 ${calculationItems.length + 1}`,
      };

      setCalculationItems((prev) => [...prev, newItem]);
      setItemAmountStr("");
      setItemDescription("");

      // 총액 업데이트
      const newTotal =
        calculationItems.reduce((sum, item) => sum + item.amount, 0) + amount;
      setCurrentAmount(newTotal);
      setAmountStr(newTotal.toString());
    }
  };

  const removeCalculationItem = (id: string) => {
    const itemToRemove = calculationItems.find((item) => item.id === id);
    if (!itemToRemove) return;

    setCalculationItems((prev) => prev.filter((item) => item.id !== id));

    // 총액 업데이트
    const newTotal =
      calculationItems.reduce((sum, item) => sum + item.amount, 0) -
      itemToRemove.amount;
    setCurrentAmount(newTotal > 0 ? newTotal : 0);
    setAmountStr(newTotal > 0 ? newTotal.toString() : "");
  };

  const clearAllItems = () => {
    setCalculationItems([]);
    setCurrentAmount(0);
    setAmountStr("");
  };

  const handleDirectAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountStr(value);

    // 숫자와 기본 수학 연산자만 허용
    if (!/^[\d+\-*/.]*$/.test(value)) {
      return;
    }

    let calculatedAmount = 0;

    if (value) {
      try {
        // 수학 표현식 계산 시도
        calculatedAmount = Math.floor(
          Function('"use strict";return (' + value + ")")()
        );
      } catch {
        // 표현식 계산 실패 시 단순 parseInt 사용
        calculatedAmount = parseInt(value);
      }

      if (!isNaN(calculatedAmount)) {
        setCurrentAmount(calculatedAmount >= 0 ? calculatedAmount : 0);
      }
    } else {
      setCurrentAmount(0);
    }
  };

  // 입력 필드 포커스 핸들러
  const handleAmountFocus = () => {
    // 입력 필드를 비움
    setAmountStr("");
  };

  // POP 로고 변경 핸들러
  const handlePOPLogoChange = (checked: boolean) => {
    setHasPOPLogo(checked);
  };

  const discountResults = calculateOptimalDiscounts(
    currentAmount,
    filter,
    hasPOPLogo
  );

  // 주말 여부와 네이버페이 선택 여부에 따라 안내 메시지 표시
  const showWeekendMessage = isWeekend() && filter.useNaverPay;

  // 최적의 결제 방법 찾기 (rank 기준으로 정렬)
  const bestDiscount =
    discountResults.length > 0
      ? discountResults.sort((a, b) => a.rank - b.rank)[0]
      : null;

  // filter가 변경될 때마다 드롭다운을 모두 접도록 useEffect 추가
  useEffect(() => {
    // 모든 카드를 접힌 상태로 초기화
    const initialExpandedState: Record<string, boolean> = {};
    discountResults.forEach((discount) => {
      initialExpandedState[discount.method] = false;
    });
    setExpandedCards(initialExpandedState);
  }, [filter]); // discountResults 의존성 제거

  return (
    <div className="space-y-4">
      {showWeekendMessage && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded relative mb-4">
          <p className="font-medium">네이버페이 금/토/일 캐시백 이벤트!</p>
          <p className="text-sm">
            오늘은{" "}
            {new Date().getDay() === 5
              ? "금요일"
              : new Date().getDay() === 6
              ? "토요일"
              : "일요일"}
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

          {/* 금액 입력 개선 UI */}
          <div className="mt-4">
            <div
              className={`flex ${
                isMobile ? "flex-col" : "items-center"
              } gap-2 mb-2`}
            >
              <Label className={isMobile ? "mb-1" : "mr-2"}>총 금액:</Label>
              <div className="flex-1 flex items-center">
                <Input
                  type="text"
                  value={amountStr}
                  onChange={handleDirectAmountChange}
                  onFocus={handleAmountFocus}
                  placeholder="5000"
                  className="w-full"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      // Enter 키를 누르면 입력된 값으로 계산
                      if (amountStr) {
                        let calculatedAmount = 0;
                        try {
                          calculatedAmount = Math.floor(
                            Function(
                              '"use strict";return (' + amountStr + ")"
                            )()
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
                <Button
                  size="sm"
                  variant="secondary"
                  className="whitespace-nowrap"
                  onClick={() => {
                    // 버튼 클릭 시 입력된 값으로 계산
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
                  }}
                >
                  할인 계산
                </Button>
              </div>
              <Button
                variant="outline"
                size={isMobile ? "default" : "sm"}
                className={isMobile ? "w-full mt-2" : "ml-2"}
                onClick={() => setIsCalculatorExpanded(!isCalculatorExpanded)}
              >
                {isCalculatorExpanded ? "간편계산 접기" : "간편계산 펼치기"}
              </Button>
            </div>

            {isCalculatorExpanded && (
              <div className="border rounded-md p-3 bg-slate-50 mt-2">
                <div className="text-sm font-medium mb-2">간편 계산기</div>

                {/* 항목 추가 입력 필드 */}
                <div className="flex gap-2 mb-3">
                  <Input
                    type="text"
                    value={itemAmountStr}
                    onChange={handleItemAmountChange}
                    placeholder="가격 (예: 1200+800)"
                    className="w-1/2"
                  />
                  <Input
                    type="text"
                    value={itemDescription}
                    onChange={handleDescriptionChange}
                    placeholder="상품명 (선택사항)"
                    className="w-1/2"
                  />
                  <Button size="sm" onClick={addCalculationItem}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* 계산 항목 목록 */}
                {calculationItems.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto mb-2">
                    {calculationItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center bg-white p-2 rounded text-sm"
                      >
                        <div className="flex-1">{item.description}</div>
                        <div className="font-medium mr-2">
                          {item.amount.toLocaleString()}원
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => removeCalculationItem(item.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 항목 합계 및 초기화 버튼 */}
                {calculationItems.length > 0 && (
                  <div className="flex justify-between items-center pt-2 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500"
                      onClick={clearAllItems}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      모두 지우기
                    </Button>
                    <div className="font-medium">
                      합계: {currentAmount.toLocaleString()}원
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div
            className={`flex items-center space-x-2 ${
              isMobile ? "mt-4" : "mt-2"
            }`}
          >
            <Checkbox
              id="popLogo"
              checked={hasPOPLogo}
              onCheckedChange={(checked: boolean) =>
                handlePOPLogoChange(checked)
              }
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
        </CardHeader>
        <CardContent>
          {currentAmount === 0 ? (
            <div className="text-center py-4">금액을 입력해 주세요</div>
          ) : discountResults.length === 0 ? (
            <div className="text-center py-4">적용 가능한 할인이 없습니다</div>
          ) : (
            <>
              {/* 모바일 화면에서는 탭 형태로 표시 */}
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
                      <div className="bg-primary/20 border-2 border-primary rounded-lg p-4 mb-4 shadow-md">
                        <div className="flex items-center text-primary mb-3">
                          <Crown className="h-6 w-6 mr-2 flex-shrink-0" />
                          <span className="font-bold text-lg break-words">
                            최적의 할인 방법 요약
                          </span>
                        </div>

                        {/* 총 혜택을 가장 눈에 띄게 표시 */}
                        <div className="bg-purple-50 border-2 border-purple-200 p-3 rounded-md text-center mb-3">
                          <div className="text-xs text-purple-700 mb-1 font-medium">
                            총 할인 혜택
                          </div>
                          <div className="font-bold text-purple-700 text-2xl">
                            {bestDiscount.totalBenefitAmount.toLocaleString()}원
                          </div>
                          <div className="text-xs text-purple-700 mt-1">
                            할인율{" "}
                            <span className="font-semibold">
                              {(bestDiscount.discountRate * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        <div className="text-sm mb-3 p-2 bg-white rounded-md border">
                          <span className="font-medium">결제 방법:</span>{" "}
                          {bestDiscount.method}
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="bg-red-50 border-2 border-red-200 p-3 rounded-md text-center">
                            <div className="text-xs text-red-700 mb-1 font-medium">
                              체감가
                            </div>
                            <div className="font-bold text-red-600 text-lg">
                              {bestDiscount.perceivedAmount.toLocaleString()}원
                            </div>
                          </div>
                          <div className="bg-green-50 border-2 border-green-200 p-3 rounded-md text-center">
                            <div className="text-xs text-green-700 mb-1 font-medium">
                              즉시 할인
                            </div>
                            <div className="font-bold text-green-600 text-lg">
                              {bestDiscount.instantDiscountAmount > 0
                                ? `-${bestDiscount.instantDiscountAmount.toLocaleString()}원`
                                : "0원"}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-blue-50 border-2 border-blue-200 p-3 rounded-md text-center">
                            <div className="text-xs text-blue-700 mb-1 font-medium">
                              미래 혜택
                            </div>
                            <div className="font-bold text-blue-600 text-lg">
                              {bestDiscount.futureDiscountAmount > 0
                                ? `-${bestDiscount.futureDiscountAmount.toLocaleString()}원`
                                : "0원"}
                            </div>
                          </div>
                          <div className="bg-gray-50 border p-3 rounded-md text-center">
                            <div className="text-xs text-gray-700 mb-1 font-medium">
                              실 결제액
                            </div>
                            <div className="font-bold text-lg">
                              {bestDiscount.finalAmount.toLocaleString()}원
                            </div>
                          </div>
                        </div>
                      </div>
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
                              } cursor-pointer`}
                              onClick={() =>
                                toggleCardExpansion(discount.method)
                              }
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <span
                                    className={
                                      bestDiscount &&
                                      discount.method === bestDiscount.method
                                        ? "font-bold text-primary whitespace-normal block"
                                        : "whitespace-normal block"
                                    }
                                  >
                                    {discount.method}
                                  </span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {discount.instantDiscountAmount > 0 && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                        즉시할인
                                      </span>
                                    )}
                                    {discount.method.includes(
                                      "네이버멤버십"
                                    ) && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                        포인트적립
                                      </span>
                                    )}
                                    {discount.method.includes("캐시백") && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                        캐시백
                                      </span>
                                    )}
                                    {discount.method.includes("할인카드") && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                        카드할인
                                      </span>
                                    )}
                                  </div>
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
                                  <div className="mt-1">
                                    {expandedCards[discount.method] ? (
                                      <ChevronUp className="h-5 w-5 text-gray-500" />
                                    ) : (
                                      <ChevronDown className="h-5 w-5 text-gray-500" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardHeader>

                            <CardContent className="pt-0 pb-3">
                              {expandedCards[discount.method] && (
                                <>
                                  {/* 할인 정보를 강조한 UI로 개선 */}
                                  <div className="rounded-lg bg-gray-50 border p-3 mb-3">
                                    <div className="grid grid-cols-1 gap-3 mb-3">
                                      <div className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-md shadow-sm border-2 border-purple-200">
                                        <span className="text-sm text-purple-700 mb-1 font-medium">
                                          총 할인 혜택
                                        </span>
                                        <span className="text-2xl font-bold text-purple-700">
                                          {discount.totalBenefitAmount.toLocaleString()}
                                          원
                                        </span>
                                        <span className="text-xs text-purple-600 mt-1">
                                          원금의{" "}
                                          <span className="font-semibold">
                                            {(
                                              discount.discountRate * 100
                                            ).toFixed(1)}
                                            %
                                          </span>
                                        </span>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="flex flex-col items-center justify-center p-3 bg-red-50 rounded-md shadow-sm border-2 border-red-200">
                                        <span className="text-xs text-red-700 mb-1 font-medium">
                                          체감가
                                        </span>
                                        <span className="text-lg font-bold text-red-600">
                                          {discount.perceivedAmount.toLocaleString()}
                                          원
                                        </span>
                                      </div>
                                      <div className="flex flex-col items-center justify-center p-3 bg-green-50 rounded-md shadow-sm border-2 border-green-200">
                                        <span className="text-xs text-green-700 mb-1 font-medium">
                                          즉시 할인
                                        </span>
                                        <span className="text-lg font-bold text-green-600">
                                          {discount.instantDiscountAmount > 0
                                            ? `-${discount.instantDiscountAmount.toLocaleString()}원`
                                            : "0원"}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-3">
                                      <div className="flex flex-col items-center justify-center p-3 bg-blue-50 rounded-md shadow-sm border-2 border-blue-200">
                                        <span className="text-xs text-blue-700 mb-1 font-medium">
                                          미래 혜택
                                        </span>
                                        <span className="text-lg font-bold text-blue-600">
                                          {discount.futureDiscountAmount > 0
                                            ? `-${discount.futureDiscountAmount.toLocaleString()}원`
                                            : "0원"}
                                        </span>
                                      </div>
                                      <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-md shadow-sm border">
                                        <span className="text-xs text-gray-700 mb-1 font-medium">
                                          실 결제액
                                        </span>
                                        <span className="text-lg font-bold">
                                          {discount.finalAmount.toLocaleString()}
                                          원
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* 상세 정보 - 펼쳐졌을 때만 표시됨 */}
                                  <div className="mt-3 pt-2 border-t border-dashed">
                                    <div className="text-sm bg-gray-50 p-3 rounded-md mb-3">
                                      <div className="flex items-center mb-2">
                                        <Gift className="h-4 w-4 mr-1 text-primary" />
                                        <span className="font-medium">
                                          혜택 상세 정보
                                        </span>
                                      </div>

                                      <div className="grid grid-cols-2 gap-2 mb-2">
                                        <div>
                                          <p className="text-xs text-gray-500">
                                            원래 금액
                                          </p>
                                          <p className="font-medium">
                                            {discount.originalAmount.toLocaleString()}
                                            원
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500">
                                            총 혜택 금액
                                          </p>
                                          <p className="font-medium text-primary">
                                            {discount.totalBenefitAmount.toLocaleString()}
                                            원
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500">
                                            즉시 할인
                                          </p>
                                          <p className="font-medium text-green-600">
                                            {discount.instantDiscountAmount > 0
                                              ? `-${discount.instantDiscountAmount.toLocaleString()}원`
                                              : "0원"}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500">
                                            미래 혜택
                                          </p>
                                          <p className="font-medium text-blue-600">
                                            {discount.futureDiscountAmount > 0
                                              ? `-${discount.futureDiscountAmount.toLocaleString()}원`
                                              : "0원"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="text-sm mb-3">
                                      <div className="flex items-center mb-2">
                                        <Zap className="h-4 w-4 mr-1 text-green-600" />
                                        <span className="font-medium">
                                          할인 혜택 구성
                                        </span>
                                      </div>

                                      <ul className="space-y-2 mt-2 text-sm">
                                        {/* 즉시 할인 섹션 */}
                                        {discount.instantDiscountAmount > 0 && (
                                          <li className="border rounded-md p-2 bg-green-50">
                                            <div className="font-medium text-green-700 border-b border-green-200 pb-1 mb-2">
                                              즉시 할인
                                            </div>
                                            <div className="flex">
                                              <span className="text-green-600 font-medium mr-2 whitespace-nowrap">
                                                할인 금액:
                                              </span>
                                              <span className="break-words">
                                                {discount.method.includes(
                                                  "네이버멤버십"
                                                )
                                                  ? "네이버멤버십 10% 할인"
                                                  : discount.method.includes(
                                                      "KT 멤버십"
                                                    ) ||
                                                    discount.method.includes(
                                                      "U+ 멤버십"
                                                    )
                                                  ? "통신사 멤버십 1,000원당 100원 할인"
                                                  : discount.method.includes(
                                                      "T 멤버십"
                                                    )
                                                  ? "T 멤버십 할인"
                                                  : "할인"}{" "}
                                              </span>
                                            </div>
                                          </li>
                                        )}

                                        {/* 미래 혜택 섹션 */}
                                        {(discount.method.includes(
                                          "네이버멤버십"
                                        ) ||
                                          discount.method.includes(
                                            "캐시백"
                                          )) && (
                                          <li className="border rounded-md p-2 bg-blue-50">
                                            <div className="font-medium text-blue-700 border-b border-blue-200 pb-1 mb-2">
                                              미래 혜택
                                            </div>

                                            {discount.method.includes(
                                              "네이버멤버십"
                                            ) && (
                                              <div className="flex mb-2">
                                                <span className="text-blue-500 font-medium mr-2 whitespace-nowrap">
                                                  포인트 적립:
                                                </span>
                                                <span className="break-words">
                                                  네이버멤버십 10% 적립 (
                                                  {Math.min(
                                                    discount.originalAmount *
                                                      0.1,
                                                    5000
                                                  ).toLocaleString()}
                                                  원)
                                                </span>
                                              </div>
                                            )}

                                            {discount.method.includes(
                                              "캐시백"
                                            ) && (
                                              <div className="flex">
                                                <span className="text-yellow-600 font-medium mr-2 whitespace-nowrap">
                                                  주말 캐시백:
                                                </span>
                                                <span className="break-words">
                                                  네이버페이 주말 캐시백 (500원)
                                                </span>
                                              </div>
                                            )}
                                          </li>
                                        )}

                                        {discount.method.includes(
                                          "할인카드"
                                        ) && (
                                          <li className="border rounded-md p-2 bg-purple-50">
                                            <div className="font-medium text-purple-700 border-b border-purple-200 pb-1 mb-2">
                                              카드 할인
                                            </div>
                                            <div className="flex">
                                              <span className="text-purple-600 font-medium mr-2 whitespace-nowrap">
                                                할인 금액:
                                              </span>
                                              <span className="break-words">
                                                {discount.method.match(
                                                  /\d+%/
                                                )?.[0] || ""}{" "}
                                                카드 할인
                                              </span>
                                            </div>
                                          </li>
                                        )}
                                      </ul>

                                      {discount.note && (
                                        <div className="text-xs text-gray-500 mt-3 border-t pt-2">
                                          <div className="flex">
                                            <span className="font-medium whitespace-nowrap mr-1">
                                              참고:
                                            </span>
                                            <span className="break-words line-clamp-2 hover:line-clamp-none">
                                              {discount.note}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </>
                              )}
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
                              즉시 할인과 미래 혜택을 모두 합친 총 혜택
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
                              결제 시점에 바로 적용되는 할인입니다. 카드 할인,
                              통신사 멤버십 할인 등이 여기에 포함됩니다.
                            </p>
                          </div>

                          <div className="p-3 border rounded-md bg-blue-50">
                            <h3 className="font-bold text-blue-800 flex items-center mb-2">
                              <Gift className="h-4 w-4 mr-1" />
                              미래 혜택
                            </h3>
                            <p className="text-sm">
                              포인트 적립, 캐시백 등 실제 결제 시점에는 할인되지
                              않고 나중에 받게 되는 혜택 금액입니다. 네이버
                              멤버십 포인트 적립, 네이버페이 주말 캐시백 등이
                              여기에 포함됩니다.
                            </p>
                          </div>

                          <div className="p-3 border rounded-md bg-red-50">
                            <h3 className="font-bold text-red-800 flex items-center mb-2">
                              <HelpCircle className="h-4 w-4 mr-1" />
                              체감가
                            </h3>
                            <p className="text-sm">
                              체감가는 원래 금액에서 즉시 할인과 미래 혜택을
                              모두 차감한 금액입니다. 즉, 실제로 소비자가
                              체감하는 가격을 의미합니다.
                            </p>
                          </div>

                          <div className="p-3 border rounded-md">
                            <h3 className="font-bold flex items-center mb-2">
                              <Info className="h-4 w-4 mr-1" />실 결제액
                            </h3>
                            <p className="text-sm">
                              원래 금액에서 즉시 할인만 차감한 실제 결제
                              금액입니다. 미래 혜택은 나중에 받게 되므로 실
                              결제액에는 반영되지 않습니다.
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
                // Desktop view - 기존 코드 유지
                <>
                  {/* 최적 할인 방법 요약 표시 (데스크톱) */}
                  {bestDiscount && (
                    <div className="bg-primary/10 border border-primary rounded-lg p-4 mb-4 flex">
                      <div className="flex items-start w-full">
                        <Crown className="h-6 w-6 text-primary mr-3 mt-1" />
                        <div className="w-full">
                          <h3 className="font-bold text-primary mb-3 break-words">
                            최적의 할인 방법: {bestDiscount.method}
                          </h3>

                          {/* 총 혜택을 가장 눈에 띄게 표시 */}
                          <div className="bg-purple-50 border-2 border-purple-200 p-3 rounded-md text-center mb-3">
                            <div className="text-sm text-purple-700 mb-1 font-medium">
                              총 할인 혜택
                            </div>
                            <div className="font-bold text-purple-700 text-2xl">
                              {bestDiscount.totalBenefitAmount.toLocaleString()}
                              원
                              <span className="text-sm ml-2 text-purple-600">
                                ({(bestDiscount.discountRate * 100).toFixed(1)}
                                %)
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-4 mb-3">
                            <div className="bg-red-50 border-2 border-red-200 p-3 rounded-md text-center">
                              <div className="text-xs text-red-700 mb-1 font-medium">
                                체감가
                              </div>
                              <div className="font-bold text-red-600">
                                {bestDiscount.perceivedAmount.toLocaleString()}
                                원
                              </div>
                            </div>
                            <div className="bg-green-50 border-2 border-green-200 p-3 rounded-md text-center">
                              <div className="text-xs text-green-700 mb-1 font-medium">
                                즉시 할인
                              </div>
                              <div className="font-bold text-green-600">
                                {bestDiscount.instantDiscountAmount > 0
                                  ? `-${bestDiscount.instantDiscountAmount.toLocaleString()}원`
                                  : "0원"}
                              </div>
                            </div>
                            <div className="bg-blue-50 border-2 border-blue-200 p-3 rounded-md text-center">
                              <div className="text-xs text-blue-700 mb-1 font-medium">
                                미래 혜택
                              </div>
                              <div className="font-bold text-blue-600">
                                {bestDiscount.futureDiscountAmount > 0
                                  ? `-${bestDiscount.futureDiscountAmount.toLocaleString()}원`
                                  : "0원"}
                              </div>
                            </div>
                            <div className="bg-white p-3 rounded border text-center">
                              <div className="text-xs text-gray-500 mb-1">
                                실 결제액
                              </div>
                              <div className="font-bold">
                                {bestDiscount.finalAmount.toLocaleString()}원
                              </div>
                              <div className="text-xs text-gray-500">
                                ({bestDiscount.originalAmount.toLocaleString()}
                                원에서)
                              </div>
                            </div>
                          </div>

                          {/* 할인액 비교 그래프 추가 */}
                          {discountResults.length > 1 && (
                            <div className="mt-4 bg-white p-3 rounded border">
                              <div className="text-sm font-medium mb-2">
                                할인액 비교
                              </div>
                              <div className="space-y-2">
                                {discountResults
                                  .sort(
                                    (a, b) =>
                                      b.totalBenefitAmount -
                                      a.totalBenefitAmount
                                  )
                                  .slice(0, 5) // 상위 5개만 표시
                                  .map((item, index) => {
                                    // 최대 할인액 대비 퍼센트 계산
                                    const maxDiscount =
                                      discountResults[0].totalBenefitAmount;
                                    const percent = Math.round(
                                      (item.totalBenefitAmount / maxDiscount) *
                                        100
                                    );

                                    return (
                                      <div
                                        key={index}
                                        className="flex flex-col"
                                      >
                                        <div className="flex justify-between text-xs mb-1">
                                          <span
                                            className={
                                              item.method ===
                                              bestDiscount.method
                                                ? "font-bold text-primary max-w-[70%] truncate"
                                                : "max-w-[70%] truncate"
                                            }
                                          >
                                            {item.method}
                                          </span>
                                          <span className="font-medium whitespace-nowrap">
                                            {item.totalBenefitAmount.toLocaleString()}
                                            원
                                          </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                          <div
                                            className={`h-2 rounded-full ${
                                              item.method ===
                                              bestDiscount.method
                                                ? "bg-primary"
                                                : "bg-blue-500"
                                            }`}
                                            style={{ width: `${percent}%` }}
                                          ></div>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 기존 테이블 */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right w-[120px] bg-purple-50">
                            <div className="flex items-center justify-end">
                              <span className="text-purple-700 font-bold">
                                총 혜택
                              </span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-3 w-3 ml-1 text-gray-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-[200px] text-center">
                                      즉시 할인과 미래 혜택을 모두 합친 총 혜택
                                      금액입니다.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableHead>
                          <TableHead className="text-right w-[120px] bg-red-50">
                            <div className="flex items-center justify-end">
                              <span className="text-red-700">체감가</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-3 w-3 ml-1 text-gray-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-[200px] text-center">
                                      체감가는 원래 금액에서 즉시할인과
                                      미래혜택을 모두 차감한 금액입니다.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableHead>
                          <TableHead className="w-[220px]">결제 방법</TableHead>
                          <TableHead className="text-right w-[100px]">
                            할인율
                          </TableHead>
                          <TableHead className="text-right w-[120px] bg-green-50">
                            <div className="flex items-center justify-end">
                              <span className="text-green-700">즉시 할인</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-3 w-3 ml-1 text-gray-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-[200px] text-center">
                                      결제 시점에 바로 적용되는 할인입니다.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableHead>
                          <TableHead className="text-right w-[120px] bg-blue-50">
                            <div className="flex items-center justify-end">
                              <span className="text-blue-700">미래 혜택</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-3 w-3 ml-1 text-gray-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-[200px] text-center">
                                      포인트 적립, 캐시백 등 실제 결제 시점에는
                                      할인되지 않고 나중에 받게 되는 혜택
                                      금액입니다.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableHead>
                          <TableHead className="text-right w-[120px]">
                            할인 전
                          </TableHead>
                          <TableHead className="text-right w-[120px]">
                            결제 금액
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* 할인액 기준으로 정렬된 결제 방법 목록을 표시 */}
                        {discountResults
                          .sort(
                            (a, b) =>
                              b.totalBenefitAmount - a.totalBenefitAmount
                          )
                          .map((discount) => (
                            <TableRow
                              key={discount.method}
                              className={
                                bestDiscount &&
                                discount.method === bestDiscount.method
                                  ? "bg-primary/5 border-l-4 border-l-primary"
                                  : ""
                              }
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
                                <div>
                                  {bestDiscount &&
                                    discount.method === bestDiscount.method && (
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
                                        ? "font-bold text-primary whitespace-normal block"
                                        : "whitespace-normal block"
                                    }
                                  >
                                    {discount.method}
                                  </span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {discount.instantDiscountAmount > 0 && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                        즉시할인
                                      </span>
                                    )}
                                    {discount.method.includes(
                                      "네이버멤버십"
                                    ) && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                        포인트적립
                                      </span>
                                    )}
                                    {discount.method.includes("캐시백") && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                        캐시백
                                      </span>
                                    )}
                                    {discount.method.includes("할인카드") && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                        카드할인
                                      </span>
                                    )}
                                  </div>
                                  {discount.note && (
                                    <p
                                      className="text-xs text-gray-500 mt-1 break-words max-w-[200px] line-clamp-2 hover:line-clamp-none"
                                      title={discount.note}
                                    >
                                      {discount.note}
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  {(discount.discountRate * 100).toFixed(1)}%
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
                                  discount.futureDiscountAmount > 0
                                    ? "text-right text-blue-600 font-bold bg-blue-50"
                                    : "text-right text-gray-500 bg-blue-50"
                                }
                              >
                                {discount.futureDiscountAmount > 0
                                  ? `-${discount.futureDiscountAmount.toLocaleString()}원`
                                  : "0원"}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {discount.originalAmount.toLocaleString()}원
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
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
