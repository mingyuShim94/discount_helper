import { IDiscountInfo, DiscountType } from "@/types/discount";
import { calculateCombinedDiscount, calculateDiscount } from "@/data/discounts";

/**
 * 통신사 멤버십과 카드 할인을 결합한 중복 할인 정보를 생성합니다.
 */
export const createCombinedDiscount = (
  membershipDiscount: IDiscountInfo,
  cardDiscount: IDiscountInfo,
  amount: number,
  membershipDiscountInfo: {
    discountRate: number;
    maxDiscount?: number;
    minAmount?: number;
  },
  cardDiscountInfo: {
    discountRate: number;
    maxDiscount?: number;
    minAmount?: number;
  }
): {
  combinedDiscount: IDiscountInfo;
  membershipAmount: number;
  cardAmount: number;
  totalSavings: number;
} => {
  // 중복 할인 계산
  const {
    totalDiscount,
    firstDiscountAmount: membershipAmount,
    secondDiscountAmount: cardAmount,
    remainingAmount,
  } = calculateCombinedDiscount(
    amount,
    membershipDiscountInfo,
    cardDiscountInfo
  );

  // 중복 할인 ID 생성 (예: combined-kt-card5percent)
  const combinedId = `combined-${membershipDiscount.id}-${cardDiscount.id}`;

  // 중복 할인 정보 생성
  const combinedDiscount: IDiscountInfo = {
    id: combinedId,
    type: DiscountType.CARD, // 중복 할인도 카드 타입으로 설정
    title: `${membershipDiscount.title} + ${cardDiscount.title} 중복 할인`,
    description: `${
      membershipDiscount.title
    }으로 ${membershipAmount.toLocaleString()}원 할인 후, 남은 금액 ${remainingAmount.toLocaleString()}원에 ${
      cardDiscount.title
    }으로 ${cardAmount.toLocaleString()}원 추가 할인받을 수 있습니다.`,
    conditions: `${membershipDiscount.conditions} / ${cardDiscount.conditions}`,
    discountRate: totalDiscount / amount, // 전체 할인율 계산
  };

  return {
    combinedDiscount,
    membershipAmount,
    cardAmount,
    totalSavings: totalDiscount,
  };
};

/**
 * 주어진 할인 정보와 금액에 대한 할인액을 계산합니다.
 */
export const calculateDiscountAmount = (
  discount: IDiscountInfo,
  amount: number,
  discountInfo: {
    discountRate: number;
    maxDiscount?: number;
    minAmount?: number;
  }
): number => {
  return calculateDiscount(amount, discountInfo);
};

/**
 * 금액 구간별 최적 할인 방법을 찾습니다.
 */
export const findOptimalDiscounts = (
  amount: number,
  availableDiscounts: {
    discount: IDiscountInfo;
    discountInfo: {
      discountRate: number;
      maxDiscount?: number;
      minAmount?: number;
    };
  }[],
  combinedDiscounts: {
    combinedDiscount: IDiscountInfo;
    membershipDiscount: IDiscountInfo;
    cardDiscount: IDiscountInfo;
    membershipAmount: number;
    cardAmount: number;
    totalSavings: number;
  }[] = []
): {
  optimalDiscounts: {
    discount: IDiscountInfo;
    savings: number;
    rank: number;
    combinedInfo?: {
      isCombined: boolean;
      membershipDiscount?: IDiscountInfo;
      cardDiscount?: IDiscountInfo;
      membershipAmount?: number;
      cardAmount?: number;
    };
  }[];
} => {
  // 모든 할인 방법에 대한 할인액 계산
  const discountsWithSavings = availableDiscounts.map((item) => {
    const savings = calculateDiscount(amount, item.discountInfo);
    return {
      discount: item.discount,
      savings,
      combinedInfo: undefined,
    };
  });

  // 중복 할인 정보 추가
  const allDiscounts = [
    ...discountsWithSavings,
    ...combinedDiscounts.map((combined) => ({
      discount: combined.combinedDiscount,
      savings: combined.totalSavings,
      combinedInfo: {
        isCombined: true,
        membershipDiscount: combined.membershipDiscount,
        cardDiscount: combined.cardDiscount,
        membershipAmount: combined.membershipAmount,
        cardAmount: combined.cardAmount,
      },
    })),
  ];

  // 할인액 기준으로 내림차순 정렬
  const sortedDiscounts = allDiscounts.sort((a, b) => b.savings - a.savings);

  // 순위 부여
  const optimalDiscounts = sortedDiscounts.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  return { optimalDiscounts };
};
