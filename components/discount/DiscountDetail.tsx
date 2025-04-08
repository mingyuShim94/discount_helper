/**
 * DiscountDetail 컴포넌트
 *
 * 할인 계산 결과를 기반으로 상세 정보를 표시하는 재사용 가능한 컴포넌트들입니다.
 * 이 파일은 분리된 컴포넌트들을 내보내는 역할을 합니다.
 */

"use client";

// 분리된 컴포넌트들을 가져옵니다.
import DiscountReceipt from "./receipt/DiscountReceipt";
import DiscountCardDetail from "./card/DiscountCardDetail";
import DiscountLineItem from "./common/DiscountLineItem";

// 타입 정의를 재내보냅니다.
export type { IDiscountReceiptProps } from "./receipt/DiscountReceipt";
export type { IDiscountCardDetailProps } from "./card/DiscountCardDetail";
export type { IDiscountLineItemProps } from "./common/DiscountLineItem";

// 컴포넌트들을 내보냅니다.
export { DiscountReceipt, DiscountCardDetail, DiscountLineItem };
