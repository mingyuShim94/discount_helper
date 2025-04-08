/**
 * useDiscountFormatter.ts
 *
 * 할인 계산 결과를 UI 컴포넌트에 표시하기 위한 데이터로 변환하는 커스텀 훅입니다.
 * DiscountReceipt와 DiscountCardDetail 컴포넌트에서 공통으로 사용하는 로직을 추출했습니다.
 */

import { useMemo, useCallback } from "react";
import { IDiscountCalculationResult } from "@/utils/discountCalculator";
import { getDiscountComponents } from "@/utils/discountPresenter";
import { calculateDiscountItemAmount } from "@/utils/discountCalculator.helper";

/**
 * 할인 파라미터 인터페이스
 */
export interface IDiscountParams {
  naverMembershipInstantAmount: number;
  naverMembershipPointAmount: number;
  tMembershipAmount: number;
  ktMembershipAmount: number;
  lgMembershipAmount: number;
  kakaoPayAmount: number;
  discountCardAmount?: number;
  cardPointAmount?: number;
  cardCashbackAmount?: number;
  naverPayCashbackAmount?: number;
  cardDiscountRate?: number;
  cardDiscountType?: string;
  [key: string]: number | string | undefined;
}

/**
 * 멤버십 유형 (키워드를 위한 상수)
 */
const MEMBERSHIP_TYPES = {
  NAVER: "네이버멤버십",
  T: "T 멤버십",
  KT: "KT 멤버십",
  LG: "U+ 멤버십",
  KAKAO: "카카오페이",
  DISCOUNT_CARD: "할인카드",
};

/**
 * 할인 데이터 포맷팅 훅
 *
 * 할인 계산 결과를 UI 컴포넌트에 필요한 형식으로 변환합니다.
 *
 * @param discount 할인 계산 결과
 * @param storeId 매장 ID
 * @returns 포맷팅된 할인 데이터와 컴포넌트 정보
 */
export function useDiscountFormatter(
  discount: IDiscountCalculationResult,
  storeId: string = "1"
) {
  // 멤버십 타입 포함 여부 확인 함수
  const includesMembership = useCallback(
    (keyword: string) => {
      return discount.method.toLowerCase().includes(keyword.toLowerCase());
    },
    [discount.method]
  );

  // 카드 할인율 추출 함수
  const getCardDiscountRate = useCallback(() => {
    if (typeof discount.cardDiscountRate === "number") {
      return discount.cardDiscountRate;
    }
    const rateMatch = discount.method.match(/(\d+)%/);
    return rateMatch ? parseInt(rateMatch[1]) : 5;
  }, [discount.cardDiscountRate, discount.method]);

  // 카드 할인 유형 결정 함수
  const determineCardDiscountType = useCallback(() => {
    if (discount.cardDiscountType) {
      return discount.cardDiscountType;
    }

    if (
      discount.pointAmount > 0 &&
      includesMembership(MEMBERSHIP_TYPES.DISCOUNT_CARD)
    ) {
      return "point";
    } else if (
      discount.cashbackAmount > 0 &&
      includesMembership(MEMBERSHIP_TYPES.DISCOUNT_CARD)
    ) {
      return "cashback";
    }

    return "instant";
  }, [
    discount.cardDiscountType,
    discount.pointAmount,
    discount.cashbackAmount,
    includesMembership,
  ]);

  // 할인 파라미터 메모이제이션
  const discountParams = useMemo(() => {
    const params: IDiscountParams = {
      naverMembershipInstantAmount: 0,
      naverMembershipPointAmount: 0,
      tMembershipAmount: 0,
      ktMembershipAmount: 0,
      lgMembershipAmount: 0,
      kakaoPayAmount: 0,
      discountCardAmount: 0,
      cardPointAmount: 0,
      cardCashbackAmount: 0,
      naverPayCashbackAmount: 0,
    };

    // 할인 방법과 할인 유형에 따라 적립금과 캐시백 금액을 구분하여 설정
    if (discount.pointAmount > 0) {
      if (
        includesMembership(MEMBERSHIP_TYPES.DISCOUNT_CARD) &&
        discount.cardDiscountType === "point"
      ) {
        // 할인카드가 적립 유형인 경우
        params.cardPointAmount = discount.pointAmount;
      } else if (includesMembership(MEMBERSHIP_TYPES.NAVER)) {
        // 네이버 멤버십으로 인한 포인트인 경우
        params.naverMembershipPointAmount = discount.pointAmount;
      }
    }

    // 캐시백 금액 설정
    if (discount.cashbackAmount > 0) {
      if (
        includesMembership(MEMBERSHIP_TYPES.DISCOUNT_CARD) &&
        discount.cardDiscountType === "cashback"
      ) {
        // 할인카드가 캐시백 유형인 경우
        params.cardCashbackAmount = discount.cashbackAmount;
      } else if (discount.method.includes("네이버페이")) {
        // 네이버페이 주말 캐시백인 경우
        params.naverPayCashbackAmount = discount.cashbackAmount;
      }
    }

    // 각 멤버십 및 결제수단 별 할인 금액 계산을 최적화
    const membershipTypes = [
      {
        key: MEMBERSHIP_TYPES.NAVER,
        paramKey: "naverMembershipInstantAmount",
      },
      {
        key: MEMBERSHIP_TYPES.T,
        paramKey: "tMembershipAmount",
      },
      {
        key: MEMBERSHIP_TYPES.KT,
        paramKey: "ktMembershipAmount",
      },
      {
        key: MEMBERSHIP_TYPES.LG,
        paramKey: "lgMembershipAmount",
      },
      {
        key: MEMBERSHIP_TYPES.KAKAO,
        paramKey: "kakaoPayAmount",
      },
      {
        key: MEMBERSHIP_TYPES.DISCOUNT_CARD,
        paramKey: "discountCardAmount",
      },
    ];

    // 한 번의 루프로 모든 멤버십 타입 처리
    membershipTypes.forEach(({ key, paramKey }) => {
      if (includesMembership(key)) {
        params[paramKey] = calculateDiscountItemAmount(
          discount,
          key,
          discount.instantDiscountAmount
        );
      }
    });

    // 할인카드 처리 추가
    if (includesMembership(MEMBERSHIP_TYPES.DISCOUNT_CARD)) {
      params.cardDiscountRate = getCardDiscountRate();
      params.cardDiscountType = determineCardDiscountType();
    }

    return params;
  }, [
    discount,
    includesMembership,
    getCardDiscountRate,
    determineCardDiscountType,
  ]);

  // 할인 컴포넌트 메모이제이션
  const discountComponents = useMemo(
    () => getDiscountComponents(discountParams, storeId),
    [discountParams, storeId]
  );

  return {
    discountParams,
    discountComponents,
  };
}
