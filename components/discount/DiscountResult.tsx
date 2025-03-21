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
  getAmountBasedRecommendations,
  getBestDiscountBreakpoints,
} from "@/utils/discountCalculator";

interface DiscountResultProps {
  filter: IDiscountFilter;
}

export function DiscountResult({ filter }: DiscountResultProps) {
  const [amount, setAmount] = useState<number>(10000);
  const [hasPOPLogo, setHasPOPLogo] = useState<boolean>(false);

  // 입력한 금액에 대한 할인 계산
  const discountResults = calculateOptimalDiscounts(amount, filter, hasPOPLogo);

  // 금액대별 최적 할인 추천 (변경된 금액 구간 기준)
  const breakpoints = getBestDiscountBreakpoints(filter, hasPOPLogo);

  // 금액 변경 핸들러
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseInt(e.target.value, 10);
    if (!isNaN(newAmount) && newAmount > 0) {
      setAmount(newAmount);
    }
  };

  // POP로고 변경 핸들러
  const handlePOPLogoChange = (checked: boolean | "indeterminate") => {
    setHasPOPLogo(checked === true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>최적 할인 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 계산기 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">할인 계산기</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">결제 금액 (원)</Label>
                <Input
                  id="amount"
                  type="number"
                  min={1000}
                  value={amount}
                  onChange={handleAmountChange}
                />
              </div>

              <div className="flex items-center space-x-2 self-end">
                <Checkbox
                  id="pop-logo"
                  checked={hasPOPLogo}
                  onCheckedChange={handlePOPLogoChange}
                />
                <Label htmlFor="pop-logo" className="font-medium">
                  POP로고 있는 상품 (네이버 전용)
                </Label>
              </div>
            </div>
          </div>

          {/* 최적 할인 결과 */}
          {discountResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">최적 할인 조합</h3>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>할인 방법</TableHead>
                      <TableHead>설명</TableHead>
                      <TableHead className="text-right">할인액</TableHead>
                      <TableHead className="text-right">최종 금액</TableHead>
                      <TableHead className="text-right">할인율</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {discountResults.map((result) => (
                      <TableRow key={result.method}>
                        <TableCell className="font-medium">
                          {result.method}
                        </TableCell>
                        <TableCell>
                          <div>{result.description}</div>
                          {result.note && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {result.note}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {result.discountAmount.toLocaleString()}원
                        </TableCell>
                        <TableCell className="text-right">
                          {result.finalAmount.toLocaleString()}원
                        </TableCell>
                        <TableCell className="text-right">
                          {(result.discountRate * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* 금액대별 최적 할인 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">금액대별 최적 할인</h3>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>구간 시작 금액</TableHead>
                    <TableHead>최적 할인 방법</TableHead>
                    <TableHead>설명</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {breakpoints.map((breakpoint) => (
                    <TableRow key={breakpoint.amount}>
                      <TableCell className="font-medium">
                        {breakpoint.amount.toLocaleString()}원~
                      </TableCell>
                      <TableCell>{breakpoint.optimalMethod}</TableCell>
                      <TableCell>{breakpoint.description}</TableCell>
                    </TableRow>
                  ))}
                  {breakpoints.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">
                        선택한 할인 수단이 없습니다
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
