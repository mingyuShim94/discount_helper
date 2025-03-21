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
import {
  calculateOptimalDiscounts,
  getBestDiscountBreakpoints,
} from "@/utils/discountCalculator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

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
  const [amountStr, setAmountStr] = useState<string>(
    (amount || 5000).toString()
  );
  const [currentAmount, setCurrentAmount] = useState<number>(amount || 5000);
  const [showBreakpoints, setShowBreakpoints] = useState<boolean>(false);
  const [hasPOPLogo, setHasPOPLogo] = useState<boolean>(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountStr(e.target.value);

    // 숫자가 아닌 입력 무시
    if (!/^\d*$/.test(e.target.value)) {
      return;
    }

    // 숫자 변환
    const newAmount = parseInt(e.target.value) || 0;
    setCurrentAmount(newAmount);
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
  const breakpoints = getBestDiscountBreakpoints(filter, hasPOPLogo);

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
          <div className="flex items-center space-x-2 mt-4">
            <Input
              type="text"
              value={amountStr}
              onChange={handleAmountChange}
              className="w-32"
            />
            <Label>원</Label>
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
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              id="showBreakpoints"
              checked={showBreakpoints}
              onCheckedChange={(checked: boolean) =>
                setShowBreakpoints(checked)
              }
            />
            <Label htmlFor="showBreakpoints">변곡점 보기</Label>
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
                      <span>즉시 할인:</span>
                      <span className="font-medium text-green-600">
                        -{bestDiscount.instantDiscountAmount.toLocaleString()}원
                      </span>
                    </div>
                    {bestDiscount.futureDiscountAmount > 0 && (
                      <div className="flex justify-between">
                        <span>미래 혜택 (적립/캐시백):</span>
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
                  </div>
                </div>
              )}

              {/* 결제 방법별 할인 정보 */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>결제 방법</TableHead>
                    <TableHead className="text-right">즉시 할인</TableHead>
                    <TableHead className="text-right">미래 혜택</TableHead>
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
                        {discount.method}
                      </TableCell>
                      <TableCell
                        className={
                          bestDiscount &&
                          discount.method === bestDiscount.method
                            ? "font-bold text-primary text-right"
                            : "text-right"
                        }
                      >
                        {discount.instantDiscountAmount.toLocaleString()}원
                      </TableCell>
                      <TableCell
                        className={
                          bestDiscount &&
                          discount.method === bestDiscount.method
                            ? "font-bold text-primary text-right"
                            : "text-right"
                        }
                      >
                        {discount.futureDiscountAmount.toLocaleString()}원
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

              {/* 변곡점 정보 */}
              {showBreakpoints && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">주요 변곡점</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    다음 금액대에서 최적 결제 방법이 변경됩니다
                  </p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>금액(원)</TableHead>
                        <TableHead>최적 결제 방법</TableHead>
                        <TableHead>설명</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {breakpoints.map((bp, index) => (
                        <TableRow key={index}>
                          <TableCell>{bp.amount.toLocaleString()}</TableCell>
                          <TableCell>{bp.optimalMethod}</TableCell>
                          <TableCell>{bp.description}</TableCell>
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
