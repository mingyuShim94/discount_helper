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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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
          <CardTitle>최적의 결제 방법</CardTitle>

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
                />
                <span className="ml-2">원</span>
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
              {/* 모바일 화면에서는 카드 형태로 표시 */}
              {isMobile ? (
                <div className="space-y-4">
                  {discountResults.map((discount) => (
                    <Card
                      key={discount.method}
                      className={
                        bestDiscount && discount.method === bestDiscount.method
                          ? "border-primary border-2 shadow-md"
                          : "border-border"
                      }
                    >
                      <CardHeader
                        className={`py-3 ${
                          bestDiscount &&
                          discount.method === bestDiscount.method
                            ? "bg-primary/5"
                            : ""
                        } cursor-pointer`}
                        onClick={() => toggleCardExpansion(discount.method)}
                      >
                        <div className="flex justify-between items-center">
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
                                  ? "font-bold text-primary"
                                  : ""
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
                              {discount.method.includes("네이버멤버십") && (
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
                            <div className="flex items-center">
                              <span className="text-sm mr-1">할인율:</span>
                              <span className="font-bold text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                {(discount.discountRate * 100).toFixed(1)}%
                              </span>
                            </div>
                            {expandedCards[discount.method] ? (
                              <ChevronUp className="h-5 w-5 text-gray-500 mt-1" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500 mt-1" />
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0 pb-3">
                        {/* 기본 정보 - 항상 표시됨 */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex flex-col py-2 border rounded-md px-3 bg-gray-50">
                            <span className="text-xs text-gray-500 mb-1">
                              최종 금액
                            </span>
                            <span
                              className={`text-base ${
                                bestDiscount &&
                                discount.method === bestDiscount.method
                                  ? "font-bold text-primary"
                                  : "font-medium"
                              }`}
                            >
                              {discount.finalAmount.toLocaleString()}원
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              할인 전:{" "}
                              {discount.originalAmount.toLocaleString()}원
                            </span>
                          </div>

                          <div className="flex flex-col py-2 border rounded-md px-3 bg-gray-50">
                            <span className="text-xs text-gray-500 mb-1">
                              체감가
                            </span>
                            <span className="text-base font-bold text-red-500">
                              {discount.perceivedAmount.toLocaleString()}원
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              {discount.instantDiscountAmount > 0 &&
                                `즉시할인: ${discount.instantDiscountAmount.toLocaleString()}원`}
                              {discount.futureDiscountAmount > 0 &&
                                (discount.instantDiscountAmount > 0
                                  ? ` + 미래혜택: ${discount.futureDiscountAmount.toLocaleString()}원`
                                  : `미래혜택: ${discount.futureDiscountAmount.toLocaleString()}원`)}
                            </span>
                          </div>
                        </div>

                        {/* 상세 정보 - 펼쳐졌을 때만 표시됨 */}
                        {expandedCards[discount.method] && (
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
                                    {discount.originalAmount.toLocaleString()}원
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

                              <p className="text-xs text-gray-600 mb-2 border-t pt-2">
                                <span className="font-medium">최종 금액</span>:
                                원래 금액에서 즉시 할인만 차감한 실제 결제 금액
                              </p>
                              <p className="text-xs text-gray-600 mb-2">
                                <span className="font-medium">체감가</span>:
                                원래 금액에서 즉시 할인과 미래 혜택을 모두
                                차감한 체감 금액
                              </p>
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
                                      <span>
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
                                          : discount.method.includes("T 멤버십")
                                          ? "T 멤버십 할인"
                                          : "할인"}{" "}
                                        (
                                        {discount.instantDiscountAmount.toLocaleString()}
                                        원)
                                      </span>
                                    </div>
                                  </li>
                                )}

                                {/* 미래 혜택 섹션 */}
                                {(discount.method.includes("네이버멤버십") ||
                                  discount.method.includes("캐시백")) && (
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
                                        <span>
                                          네이버멤버십 10% 적립 (
                                          {Math.min(
                                            discount.originalAmount * 0.1,
                                            5000
                                          ).toLocaleString()}
                                          원)
                                          <span className="text-xs text-gray-500 block mt-1">
                                            * 1일 1회 최대 5,000원까지
                                            적립됩니다.
                                            <br />*{" "}
                                            <span className="text-blue-600 font-medium">
                                              미래 혜택
                                            </span>
                                            으로 실제 결제 시점에는 할인되지
                                            않고, 나중에 적립됩니다
                                          </span>
                                        </span>
                                      </div>
                                    )}

                                    {discount.method.includes("캐시백") && (
                                      <div className="flex">
                                        <span className="text-yellow-600 font-medium mr-2 whitespace-nowrap">
                                          주말 캐시백:
                                        </span>
                                        <span>
                                          네이버페이 주말 캐시백 (500원)
                                          <span className="text-xs text-gray-500 block mt-1">
                                            * 금/토/일 한정, 2,000원 이상 결제
                                            시 제공
                                            <br />* 이벤트 사전 신청 필요
                                            <br />*{" "}
                                            <span className="text-blue-600 font-medium">
                                              미래 혜택
                                            </span>
                                            으로 실제 결제 시점에는 할인되지
                                            않고, 나중에 적립됩니다
                                          </span>
                                        </span>
                                      </div>
                                    )}
                                  </li>
                                )}

                                {discount.method.includes("할인카드") && (
                                  <li className="border rounded-md p-2 bg-purple-50">
                                    <div className="font-medium text-purple-700 border-b border-purple-200 pb-1 mb-2">
                                      카드 할인
                                    </div>
                                    <div className="flex">
                                      <span className="text-purple-600 font-medium mr-2 whitespace-nowrap">
                                        할인 금액:
                                      </span>
                                      <span>
                                        {discount.method.match(/\d+%/)?.[0] ||
                                          ""}{" "}
                                        카드 할인
                                        {discount.method.includes("멤버십") && (
                                          <span className="text-xs text-gray-500 block mt-1">
                                            * 통신사 멤버십 할인 적용 후 남은
                                            금액 기준으로 계산됩니다.
                                          </span>
                                        )}
                                      </span>
                                    </div>
                                  </li>
                                )}
                              </ul>

                              {discount.note && (
                                <div className="text-xs text-gray-500 mt-3 border-t pt-2">
                                  <span className="font-medium">참고:</span>{" "}
                                  {discount.note}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                // Desktop view (Table)
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[220px]">결제 방법</TableHead>
                        <TableHead className="text-right w-[120px]">
                          할인 전
                        </TableHead>
                        <TableHead className="text-right w-[120px]">
                          즉시 할인
                        </TableHead>
                        <TableHead className="text-right w-[120px]">
                          <div className="flex items-center justify-end">
                            <span>미래 혜택</span>
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
                          최종 금액
                        </TableHead>
                        <TableHead className="text-right w-[120px]">
                          <div className="flex items-center justify-end">
                            <span>체감가</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-3 w-3 ml-1 text-gray-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-[200px] text-center">
                                    체감가는 원래 금액에서 즉시할인과 미래혜택을
                                    모두 차감한 금액입니다.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableHead>
                        <TableHead className="text-right w-[100px]">
                          할인율
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {discountResults.map((discount) => (
                        <TableRow
                          key={discount.method}
                          className={
                            bestDiscount &&
                            discount.method === bestDiscount.method
                              ? "bg-primary/5 border-l-4 border-l-primary"
                              : ""
                          }
                        >
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
                                    ? "font-bold text-primary"
                                    : ""
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
                                {discount.method.includes("네이버멤버십") && (
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
                                  className="text-xs text-gray-500 mt-1 truncate max-w-[200px]"
                                  title={discount.note}
                                >
                                  {discount.note}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {discount.originalAmount.toLocaleString()}원
                          </TableCell>
                          <TableCell
                            className={
                              discount.instantDiscountAmount > 0
                                ? "text-right text-green-600 font-medium"
                                : "text-right text-gray-500"
                            }
                          >
                            {discount.instantDiscountAmount > 0
                              ? `-${discount.instantDiscountAmount.toLocaleString()}원`
                              : "0원"}
                          </TableCell>
                          <TableCell
                            className={
                              discount.futureDiscountAmount > 0
                                ? "text-right text-blue-600 font-medium"
                                : "text-right text-gray-500"
                            }
                          >
                            {discount.futureDiscountAmount > 0
                              ? `-${discount.futureDiscountAmount.toLocaleString()}원`
                              : "0원"}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {discount.finalAmount.toLocaleString()}원
                            <div className="text-xs text-gray-500 font-normal">
                              실제 결제액
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-bold text-red-500">
                            {discount.perceivedAmount.toLocaleString()}원
                            <div className="text-xs text-gray-500 font-normal">
                              체감 금액
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              {(discount.discountRate * 100).toFixed(1)}%
                            </span>
                            <div className="text-xs mt-1">
                              {discount.totalBenefitAmount.toLocaleString()}원
                              혜택
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
