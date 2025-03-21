"use client";

import { useState } from "react";
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
import { HelpCircle, Gift, Zap, Plus, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
            <div className="flex items-center mb-2">
              <Label className="mr-2">총 금액:</Label>
              <div className="flex-1 flex items-center">
                <Input
                  type="text"
                  value={amountStr}
                  onChange={handleDirectAmountChange}
                  placeholder="금액 또는 계산식 입력"
                  className="w-full"
                />
                <span className="ml-2">원</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
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

          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              id="popLogo"
              checked={hasPOPLogo}
              onCheckedChange={(checked: boolean) =>
                handlePOPLogoChange(checked)
              }
            />
            <Label htmlFor="popLogo">POP 로고 있는 상품</Label>
          </div>
        </CardHeader>
        <CardContent>
          {currentAmount === 0 ? (
            <div className="text-center py-4">금액을 입력해 주세요</div>
          ) : discountResults.length === 0 ? (
            <div className="text-center py-4">적용 가능한 할인이 없습니다</div>
          ) : (
            <>
              {bestDiscount && (
                <div className="mb-4">
                  <div className="text-xl font-bold mb-4">
                    최적의 결제 방법:{" "}
                    <span className="text-primary">{bestDiscount.method}</span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between">
                      <span>할인 전 금액:</span>
                      <span className="font-medium">
                        {currentAmount.toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <Zap className="h-4 w-4 mr-1 text-green-600" />
                        즉시 할인:
                      </span>
                      <span className="font-medium text-green-600">
                        -{bestDiscount.instantDiscountAmount.toLocaleString()}원
                      </span>
                    </div>
                    {bestDiscount.futureDiscountAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="flex items-center">
                          <Gift className="h-4 w-4 mr-1 text-blue-500" />
                          미래 혜택 (적립/캐시백):
                        </span>
                        <span className="font-medium text-blue-500">
                          {bestDiscount.futureDiscountAmount.toLocaleString()}원
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl mt-2">
                      <span>최종 결제 금액:</span>
                      <span className="font-bold">
                        {bestDiscount.finalAmount.toLocaleString()}원
                      </span>
                    </div>
                    {bestDiscount.futureDiscountAmount > 0 && (
                      <div className="flex justify-between text-lg mt-2">
                        <span className="flex items-center">
                          체감가:
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 ml-1 text-gray-500" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>
                                  체감가는 원래 금액에서 즉시할인과
                                  미래혜택(적립금, 캐시백)을 모두 차감한
                                  금액으로, 소비자가 실질적으로 체감하는
                                  가격입니다.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </span>
                        <span className="font-bold text-red-500">
                          {bestDiscount.perceivedAmount.toLocaleString()}원
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>총 혜택:</span>
                      <span>
                        {bestDiscount.totalBenefitAmount.toLocaleString()}원 (
                        {(bestDiscount.discountRate * 100).toFixed(1)}%)
                      </span>
                    </div>

                    {/* 혜택 상세 정보 추가 */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
                      <h4 className="font-medium mb-1">혜택 상세</h4>
                      <ul className="space-y-1 list-disc ml-5">
                        {bestDiscount.instantDiscountAmount > 0 && (
                          <li>
                            <span className="text-green-600 font-medium">
                              즉시 할인:
                            </span>
                            {bestDiscount.method.includes("네이버멤버십")
                              ? "네이버멤버십 10% 할인"
                              : "통신사 멤버십 1,000원당 100원 할인"}
                            (
                            {bestDiscount.instantDiscountAmount.toLocaleString()}
                            원)
                          </li>
                        )}

                        {bestDiscount.method.includes("네이버멤버십") && (
                          <li>
                            <span className="text-blue-500 font-medium">
                              포인트 적립:
                            </span>
                            네이버멤버십 10% 적립 (
                            {Math.min(
                              bestDiscount.originalAmount * 0.1,
                              5000
                            ).toLocaleString()}
                            원)
                          </li>
                        )}

                        {bestDiscount.method.includes("캐시백") && (
                          <li>
                            <span className="text-blue-500 font-medium">
                              주말 캐시백:
                            </span>
                            네이버페이 주말 캐시백 (500원)
                            <span className="text-xs text-gray-500 block ml-1 mt-0.5">
                              * 주말 한정, 2,000원 이상 결제, 사전 신청 필수
                            </span>
                          </li>
                        )}

                        {bestDiscount.method.includes("할인카드") && (
                          <li>
                            <span className="text-blue-500 font-medium">
                              카드 할인:
                            </span>
                            {bestDiscount.method.match(/\d+%/)?.[0] || ""} 카드
                            할인
                            {bestDiscount.method.includes("멤버십")
                              ? "(통신사 멤버십 적용 후 남은 금액 기준)"
                              : ""}
                          </li>
                        )}
                      </ul>

                      {bestDiscount.note && (
                        <p className="text-xs text-gray-500 mt-2">
                          <span className="font-medium">참고:</span>{" "}
                          {bestDiscount.note}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 결제 방법별 할인 정보 */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>결제 방법</TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end">
                        <Zap className="h-4 w-4 mr-1 text-green-600" />
                        즉시 할인
                      </div>
                    </TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end">
                        <Gift className="h-4 w-4 mr-1 text-blue-500" />
                        미래 혜택
                      </div>
                    </TableHead>
                    <TableHead className="text-right">총 혜택</TableHead>
                    <TableHead className="text-right">최종 금액</TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end">
                        체감가
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 ml-1 text-gray-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-[200px]">
                                원래 금액에서 즉시할인과 미래혜택을 모두 차감한
                                금액
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discountResults.map((discount) => (
                    <TableRow key={discount.method}>
                      <TableCell
                        className={
                          bestDiscount &&
                          discount.method === bestDiscount.method
                            ? "font-bold text-primary"
                            : ""
                        }
                      >
                        <div>
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
                      </TableCell>
                      <TableCell
                        className={
                          bestDiscount &&
                          discount.method === bestDiscount.method
                            ? "font-bold text-primary text-right"
                            : "text-right"
                        }
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                {discount.instantDiscountAmount.toLocaleString()}
                                원
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-[200px]">
                                {discount.method.includes("멤버십")
                                  ? discount.method.includes("네이버")
                                    ? "네이버멤버십 10% 즉시할인"
                                    : "통신사 멤버십 1,000원당 100원 할인"
                                  : "즉시 할인 없음"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell
                        className={
                          bestDiscount &&
                          discount.method === bestDiscount.method
                            ? "font-bold text-primary text-right"
                            : "text-right"
                        }
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                {discount.futureDiscountAmount.toLocaleString()}
                                원
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="max-w-[200px]">
                                {discount.method.includes("네이버멤버십") &&
                                  "네이버멤버십 10% 적립"}
                                {discount.method.includes("캐시백") &&
                                  (discount.method.includes("네이버멤버십")
                                    ? " + "
                                    : "") + "네이버페이 주말 캐시백 500원"}
                                {discount.method.includes("할인카드") &&
                                  `할인카드 ${
                                    discount.method.match(/\d+%/)?.[0] || ""
                                  } 할인`}
                                {discount.futureDiscountAmount === 0 &&
                                  "미래 혜택 없음"}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell
                        className={
                          bestDiscount &&
                          discount.method === bestDiscount.method
                            ? "font-bold text-primary text-right"
                            : "text-right"
                        }
                      >
                        {discount.totalBenefitAmount.toLocaleString()}원
                      </TableCell>
                      <TableCell
                        className={
                          bestDiscount &&
                          discount.method === bestDiscount.method
                            ? "font-bold text-primary text-right"
                            : "text-right"
                        }
                      >
                        {discount.finalAmount.toLocaleString()}원
                      </TableCell>
                      <TableCell
                        className={
                          bestDiscount &&
                          discount.method === bestDiscount.method
                            ? "font-bold text-red-500 text-right"
                            : "text-right"
                        }
                      >
                        {discount.perceivedAmount.toLocaleString()}원
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
