import { IDiscountFilter } from "@/types/discountFilter";
import { getDiscountRules } from "@/lib/data/discountRules";

/**
 * 현재 한국 시간 기준 요일이 금/토/일인지 확인합니다.
 * @returns 금/토/일이면 true, 아니면 false
 */
function isWeekend(): boolean {
  // 현재 날짜 기준 요일 확인 (로컬 시스템 시간 사용)
  const now = new Date();
  const day = now.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일

  // 금요일(5), 토요일(6), 일요일(0)인 경우 true 반환
  const isWeekendDay = day === 0 || day === 5 || day === 6;
  return isWeekendDay;
}

/**
 * 통신사 멤버십 시간 제한이 유효한지 확인합니다.
 * @param timeRestriction 시간 제한 정보
 * @returns 유효하면 true, 그렇지 않으면 false
 */
function isTimeRestrictionValid(timeRestriction?: {
  startHour: number;
  endHour: number;
}): boolean {
  // 시간 제한이 없는 경우
  if (!timeRestriction) {
    return true;
  }

  // 현재 시간 확인
  const now = new Date();
  const currentHour = now.getHours();

  // 현재 시간이 제한 시간 범위 내에 있는지 확인
  return (
    currentHour >= timeRestriction.startHour &&
    currentHour < timeRestriction.endHour
  );
}

/**
 * CU의 KT 멤버십 특별 제한을 확인합니다.
 * @param storeId 매장 ID
 * @param carrier 통신사 정보
 * @param carrierInfo 통신사 멤버십 정보
 * @param filter 할인 필터 정보
 * @returns 유효하면 true, 그렇지 않으면 false
 */
function isCarrierMembershipValid(
  storeId: string,
  carrier: string,
  carrierInfo: CarrierMembershipInfo | Record<string, unknown>,
  filter: IDiscountFilter
): boolean {
  // 활성화되지 않은 멤버십인 경우
  if (!carrierInfo || !("enabled" in carrierInfo) || !carrierInfo.enabled) {
    return false;
  }

  // CU에서 KT 멤버십의 경우, 시간 제한과 상품 제한 확인
  if (storeId === "2" && carrier === "kt") {
    // CU의 KT 멤버십은 오전 5~9시에만 적용되고, 간편식 상품만 해당됨
    // 시간 제한 확인
    if (
      !isTimeRestrictionValid(
        "timeRestriction" in carrierInfo
          ? (carrierInfo.timeRestriction as {
              startHour: number;
              endHour: number;
            })
          : undefined
      )
    ) {
      return false;
    }

    // 간편식 상품 선택 확인
    const isConvenienceFood =
      filter.storeSpecificOptions?.["2"]?.isConvenienceFood || false;
    if (!isConvenienceFood) {
      return false;
    }

    return true;
  }

  // 그 외의 경우 기본적으로 유효함
  return true;
}

/**
 * 할인액을 계산합니다.
 * @param amount 총 금액
 * @param discountInfo 할인 정보
 * @returns 할인액
 */
export const calculateDiscount = (
  amount: number,
  discountInfo: {
    discountRate: number;
    maxDiscount?: number;
    minAmount?: number;
  }
): number => {
  // 최소 금액 체크
  if (discountInfo.minAmount && amount < discountInfo.minAmount) {
    return 0;
  }

  // 할인액 계산
  const discountAmount = amount * (discountInfo.discountRate / 100);

  // 1원 미만 할인액은 0원으로 처리
  if (discountAmount < 1) {
    return 0;
  }

  // 최대 할인액 제한
  if (discountInfo.maxDiscount) {
    return Math.min(discountAmount, discountInfo.maxDiscount);
  }

  return discountAmount;
};

/**
 * 중복 할인을 계산합니다.
 * @param amount 총 금액
 * @param firstDiscountInfo 첫 번째 할인 정보 (멤버십)
 * @param secondDiscountInfo 두 번째 할인 정보 (카드)
 * @returns 할인 결과 정보
 */
export const calculateCombinedDiscount = (
  amount: number,
  firstDiscountInfo: {
    discountRate: number;
    maxDiscount?: number;
    minAmount?: number;
  },
  secondDiscountInfo: {
    discountRate: number;
    maxDiscount?: number;
    minAmount?: number;
  }
): {
  totalDiscount: number;
  firstDiscountAmount: number;
  secondDiscountAmount: number;
  remainingAmount: number;
} => {
  // 첫 번째 할인액 계산 (멤버십)
  const firstDiscountAmount = calculateDiscount(amount, firstDiscountInfo);

  // 첫 번째 할인 후 남은 금액
  const remainingAmount = amount - firstDiscountAmount;

  // 두 번째 할인액 계산 (카드)
  const secondDiscountAmount = calculateDiscount(
    remainingAmount,
    secondDiscountInfo
  );

  // 총 할인액
  const totalDiscount = firstDiscountAmount + secondDiscountAmount;

  return {
    totalDiscount,
    firstDiscountAmount,
    secondDiscountAmount,
    remainingAmount,
  };
};

export interface IDiscountCalculationResult {
  method: string; // 결제 방법
  description: string; // 설명
  originalAmount: number; // 원래 금액
  instantDiscountAmount: number; // 즉시 할인 금액 (결제 시점에 차감)
  pointAmount: number; // 적립 금액 (결제 후 받는 포인트)
  cashbackAmount: number; // 캐시백 금액 (결제 후 받는 현금성 혜택)
  totalBenefitAmount: number; // 총 혜택 금액 (instantDiscountAmount + pointAmount + cashbackAmount)
  finalAmount: number; // 실제 결제 금액 (originalAmount - instantDiscountAmount)
  perceivedAmount: number; // 체감가 (originalAmount - instantDiscountAmount - pointAmount - cashbackAmount)
  discountRate: number; // 총 혜택율 (totalBenefitAmount / originalAmount)
  rank: number; // 순위
  note?: string; // 추가 설명
  cardDiscountRate?: number; // 카드 할인율 (%)
  cardDiscountType?: "instant" | "point" | "cashback"; // 카드 할인 타입
}

// 할인 수단별 최소 결제 금액 정의
const MIN_PURCHASE_AMOUNTS = {
  CARRIER: 1000, // 통신사 멤버십 최소 결제 금액
  NAVER: 0, // 네이버 멤버십 최소 결제 금액 (제한 없음)
  CARD: 0, // 할인 카드 최소 결제 금액 (제한 없음)
};

// 타입 정의 추가
interface CarrierMembershipInfo {
  enabled: boolean;
  discountRate: number;
  restrictions?: string[];
  excludedProducts?: string[];
  timeRestriction?: {
    startHour: number;
    endHour: number;
  };
  productRestriction?: string;
}

/**
 * 각 매장의 할인 정보를 바탕으로 최적 할인을 계산합니다.
 */
export function calculateOptimalDiscounts(
  amount: number,
  filter: IDiscountFilter,
  hasPOPLogo: boolean = false,
  storeId: string = "1" // 기본값은 GS25
): IDiscountCalculationResult[] {
  const results: IDiscountCalculationResult[] = [];

  // 매장의 할인 정책 가져오기
  const discountRules = getDiscountRules(storeId);

  if (!discountRules) {
    // 할인 정책이 없는 경우 빈 결과 반환
    return [
      {
        method: "할인 없음",
        description: "이 매장에 대한 할인 정책 정보가 없습니다",
        originalAmount: amount,
        instantDiscountAmount: 0,
        pointAmount: 0,
        cashbackAmount: 0,
        totalBenefitAmount: 0,
        finalAmount: amount,
        perceivedAmount: amount,
        discountRate: 0,
        rank: 1,
      },
    ];
  }

  // 현재 주말인지 확인
  const isWeekendNow = isWeekend();

  // 통신사 멤버십 + 네이버페이 주말 캐시백 조합
  if (
    (filter.carrier === "kt" || filter.carrier === "lg") &&
    filter.useNaverPay &&
    isWeekendNow &&
    amount >= MIN_PURCHASE_AMOUNTS.CARRIER
  ) {
    // 선택한 통신사 멤버십 정보 가져오기
    const carrierInfo =
      filter.carrier === "kt"
        ? discountRules.carrierMembership.kt
        : discountRules.carrierMembership.lg;

    // 타입 안전성을 위한 체크 및 멤버십 유효성 확인
    if (
      carrierInfo &&
      typeof carrierInfo === "object" &&
      "enabled" in carrierInfo &&
      carrierInfo.enabled &&
      "discountRate" in carrierInfo &&
      isCarrierMembershipValid(storeId, filter.carrier, carrierInfo, filter)
    ) {
      // carrierInfo를 적절한 타입으로 단언
      const typedCarrierInfo = carrierInfo as CarrierMembershipInfo;

      // 할인액 계산 방식을 매장과 통신사에 따라 다르게 적용
      const carrierDiscountAmount = calculateCarrierDiscountAmount(
        amount,
        storeId,
        filter.carrier,
        typedCarrierInfo.discountRate
      );
      const remainingAmount = amount - carrierDiscountAmount;

      // 네이버페이 주말 캐시백 정보 가져오기
      const naverPayWeekend = discountRules.naverPayWeekend;

      // 네이버페이 캐시백은 최소 금액 이상 결제 시 적용
      let cashbackAmount = 0;
      if (
        naverPayWeekend.enabled &&
        remainingAmount >= naverPayWeekend.minAmount
      ) {
        cashbackAmount = naverPayWeekend.cashbackAmount;
      }

      const totalBenefitAmount = carrierDiscountAmount + cashbackAmount;

      results.push({
        method: `${
          filter.carrier === "kt" ? "KT" : "U+"
        } 멤버십 + 네이버페이 주말 캐시백`,
        description: `1,000원당 ${
          typedCarrierInfo.discountRate * 1000
        }원 할인 후 네이버페이로 결제하여 ${cashbackAmount}원 캐시백`,
        originalAmount: amount,
        instantDiscountAmount: carrierDiscountAmount,
        pointAmount: 0,
        cashbackAmount: cashbackAmount,
        totalBenefitAmount: totalBenefitAmount,
        finalAmount: amount - carrierDiscountAmount, // 즉시할인만 차감
        perceivedAmount: amount - totalBenefitAmount, // 즉시할인 + 캐시백 차감
        discountRate: totalBenefitAmount / amount,
        rank: 1,
        note: "통신사 멤버십 적용 후 네이버페이로 결제, 네이버페이 주말 캐시백 사전 신청 필수",
      });
    }
  }

  // 네이버페이 선택 & 주말 & 최소 금액 이상인 경우 주말 캐시백 적용
  if (
    filter.useNaverPay &&
    isWeekendNow &&
    discountRules.naverPayWeekend.enabled
  ) {
    const naverPayWeekend = discountRules.naverPayWeekend;

    if (amount >= naverPayWeekend.minAmount) {
      const cashbackAmount = naverPayWeekend.cashbackAmount;

      results.push({
        method: "네이버페이 주말 캐시백",
        description: `${naverPayWeekend.minAmount}원 이상 결제 시 ${cashbackAmount}원 캐시백`,
        originalAmount: amount,
        instantDiscountAmount: 0,
        pointAmount: 0,
        cashbackAmount: cashbackAmount,
        totalBenefitAmount: cashbackAmount,
        finalAmount: amount, // 캐시백은 실제 결제 금액에서 차감되지 않음
        perceivedAmount: amount - cashbackAmount,
        discountRate: cashbackAmount / amount,
        rank: 1,
        note: "금/토/일 한정, 포인트머니 결제 필요, 하루 1회 (주 최대 3회), 사전 신청 필수",
      });
    }
  }

  // 네이버 멤버십 + 네이버페이
  if (
    filter.useNaverMembership &&
    filter.useNaverPay &&
    discountRules.naverMembership.enabled
  ) {
    const naverMembership = discountRules.naverMembership;

    // POP 로고 제한 확인
    const isPOPRestricted = naverMembership.productRestriction === "popLogo";

    if (!isPOPRestricted || (isPOPRestricted && hasPOPLogo)) {
      const discountRate = naverMembership.instantDiscountRate;
      const pointRate = naverMembership.pointRate;
      const discountAmount = amount * discountRate;
      const pointAmount = amount * pointRate;
      const maxPointAmount = Math.min(
        pointAmount,
        naverMembership.maxPointAmount
      );

      // 즉시 할인 후 금액 계산
      const amountAfterDiscount = amount - discountAmount;

      // 할인 후 금액이 최소 금액 이상이면서 주말인 경우 캐시백 적용
      let cashbackAmount = 0;
      if (
        isWeekendNow &&
        discountRules.naverPayWeekend.enabled &&
        amountAfterDiscount >= discountRules.naverPayWeekend.minAmount
      ) {
        cashbackAmount = discountRules.naverPayWeekend.cashbackAmount;
      }

      const totalBenefitAmount =
        discountAmount + maxPointAmount + cashbackAmount;

      results.push({
        method:
          cashbackAmount > 0
            ? "네이버멤버십 + 네이버페이 + 주말 캐시백"
            : "네이버멤버십 + 네이버페이",
        description:
          cashbackAmount > 0
            ? `${discountRate * 100}% 즉시할인 + ${
                pointRate * 100
              }% 즉시적립 + ${cashbackAmount}원 캐시백`
            : `${discountRate * 100}% 즉시할인 + ${pointRate * 100}% 즉시적립`,
        originalAmount: amount,
        instantDiscountAmount: discountAmount,
        pointAmount: maxPointAmount,
        cashbackAmount: cashbackAmount,
        totalBenefitAmount: totalBenefitAmount,
        finalAmount: amountAfterDiscount, // 즉시할인만 최종금액에서 차감
        perceivedAmount: amount - totalBenefitAmount,
        discountRate: totalBenefitAmount / amount,
        rank: 1,
        note:
          cashbackAmount > 0
            ? `${isPOPRestricted ? "POP로고 상품 한정, " : ""}적립은 1일 최대 ${
                naverMembership.maxPointAmount
              }원, 주말 캐시백은 사전 신청 필수`
            : `${isPOPRestricted ? "POP로고 상품 한정, " : ""}적립은 1일 최대 ${
                naverMembership.maxPointAmount
              }원`,
      });
    }
  }

  // 통신사 멤버십 + 할인카드 조합
  if (
    filter.carrier !== "none" &&
    filter.useCardDiscount &&
    filter.customCardDiscountRate !== undefined &&
    amount >= MIN_PURCHASE_AMOUNTS.CARRIER
  ) {
    // 선택한 통신사 멤버십 정보 가져오기
    const carrierInfo =
      filter.carrier === "skt"
        ? discountRules.carrierMembership.skt
        : filter.carrier === "kt"
        ? discountRules.carrierMembership.kt
        : discountRules.carrierMembership.lg;

    // 타입 안전성을 위한 체크 및 멤버십 유효성 확인
    if (
      carrierInfo &&
      typeof carrierInfo === "object" &&
      "enabled" in carrierInfo &&
      carrierInfo.enabled &&
      "discountRate" in carrierInfo &&
      isCarrierMembershipValid(storeId, filter.carrier, carrierInfo, filter)
    ) {
      // carrierInfo를 적절한 타입으로 단언
      const typedCarrierInfo = carrierInfo as CarrierMembershipInfo;

      // 할인액 계산 방식을 매장과 통신사에 따라 다르게 적용
      const carrierDiscountAmount = calculateCarrierDiscountAmount(
        amount,
        storeId,
        filter.carrier,
        typedCarrierInfo.discountRate
      );
      const remainingAmount = amount - carrierDiscountAmount;

      const cardDiscountRate = filter.customCardDiscountRate / 100;
      const cardDiscountAmount = remainingAmount * cardDiscountRate;
      const totalDiscountAmount = carrierDiscountAmount + cardDiscountAmount;

      // restrictions 속성 안전하게 접근
      const restrictions = typedCarrierInfo.restrictions
        ? typedCarrierInfo.restrictions.join(", ")
        : "1일 1회 사용 가능, 행사상품/담배/주류 제외";

      // 카드 할인 타입에 따라 즉시 할인과 적립/캐시백 구분
      const isInstantDiscount = filter.cardDiscountType === "instant";
      const instantDiscount =
        carrierDiscountAmount + (isInstantDiscount ? cardDiscountAmount : 0);
      const pointAmount =
        filter.cardDiscountType === "point" ? cardDiscountAmount : 0;
      const cashbackAmount =
        filter.cardDiscountType === "cashback" ? cardDiscountAmount : 0;

      results.push({
        method: `${
          filter.carrier === "skt" ? "T" : filter.carrier === "kt" ? "KT" : "U+"
        } 멤버십 + ${filter.customCardDiscountRate}% 할인카드`,
        description: `1,000원당 ${
          typedCarrierInfo.discountRate * 1000
        }원 할인 후 ${filter.customCardDiscountRate}% 할인`,
        originalAmount: amount,
        instantDiscountAmount: instantDiscount,
        pointAmount: pointAmount,
        cashbackAmount: cashbackAmount,
        totalBenefitAmount: totalDiscountAmount,
        finalAmount: amount - instantDiscount,
        perceivedAmount: amount - totalDiscountAmount,
        discountRate: totalDiscountAmount / amount,
        rank: results.length + 1,
        note: restrictions,
        cardDiscountRate: filter.customCardDiscountRate,
        cardDiscountType: filter.cardDiscountType,
      });
    }
  }

  // 통신사 멤버십 단독 사용
  if (filter.carrier !== "none" && amount >= MIN_PURCHASE_AMOUNTS.CARRIER) {
    // 선택한 통신사 멤버십 정보 가져오기
    const carrierInfo =
      filter.carrier === "skt"
        ? discountRules.carrierMembership.skt
        : filter.carrier === "kt"
        ? discountRules.carrierMembership.kt
        : discountRules.carrierMembership.lg;

    // 타입 안전성을 위한 체크 및 멤버십 유효성 확인
    if (
      carrierInfo &&
      typeof carrierInfo === "object" &&
      "enabled" in carrierInfo &&
      carrierInfo.enabled &&
      "discountRate" in carrierInfo &&
      isCarrierMembershipValid(storeId, filter.carrier, carrierInfo, filter)
    ) {
      // carrierInfo를 적절한 타입으로 단언
      const typedCarrierInfo = carrierInfo as CarrierMembershipInfo;

      // 할인액 계산 방식을 매장과 통신사에 따라 다르게 적용
      const carrierDiscountAmount = calculateCarrierDiscountAmount(
        amount,
        storeId,
        filter.carrier,
        typedCarrierInfo.discountRate
      );

      // restrictions 속성 안전하게 접근
      const restrictions = typedCarrierInfo.restrictions
        ? typedCarrierInfo.restrictions.join(", ")
        : "1일 1회 사용 가능, 행사상품/담배/주류 제외";

      results.push({
        method: `${
          filter.carrier === "skt" ? "T" : filter.carrier === "kt" ? "KT" : "U+"
        } 멤버십`,
        description: `1,000원당 ${typedCarrierInfo.discountRate * 1000}원 할인`,
        originalAmount: amount,
        instantDiscountAmount: carrierDiscountAmount,
        pointAmount: 0,
        cashbackAmount: 0,
        totalBenefitAmount: carrierDiscountAmount,
        finalAmount: amount - carrierDiscountAmount,
        perceivedAmount: amount - carrierDiscountAmount,
        discountRate: carrierDiscountAmount / amount,
        rank: results.length + 1,
        note: restrictions,
      });
    }
  }

  // 할인카드 단독 사용
  if (filter.useCardDiscount && filter.customCardDiscountRate) {
    const cardDiscountRate = filter.customCardDiscountRate / 100;
    const cardDiscountAmount = amount * cardDiscountRate;

    // 카드 할인 타입에 따라 즉시 할인과 적립/캐시백 구분
    const isInstantDiscount = filter.cardDiscountType === "instant";
    const pointAmount =
      filter.cardDiscountType === "point" ? cardDiscountAmount : 0;
    const cashbackAmount =
      filter.cardDiscountType === "cashback" ? cardDiscountAmount : 0;

    results.push({
      method: `${filter.customCardDiscountRate}% 할인카드`,
      description: `${filter.customCardDiscountRate}% 할인`,
      originalAmount: amount,
      instantDiscountAmount: isInstantDiscount ? cardDiscountAmount : 0,
      pointAmount: pointAmount,
      cashbackAmount: cashbackAmount,
      totalBenefitAmount: cardDiscountAmount,
      finalAmount: isInstantDiscount ? amount - cardDiscountAmount : amount,
      perceivedAmount: amount - cardDiscountAmount,
      discountRate: cardDiscountRate,
      rank: results.length + 1,
      cardDiscountRate: filter.customCardDiscountRate,
      cardDiscountType: filter.cardDiscountType,
    });
  }

  // 통신사 멤버십 + 카카오페이 굿딜 조합
  if (
    filter.carrier !== "none" &&
    filter.useKakaoPay &&
    discountRules.kakaoPay?.enabled &&
    amount >= MIN_PURCHASE_AMOUNTS.CARRIER
  ) {
    // 선택한 통신사 멤버십 정보 가져오기
    const carrierInfo =
      filter.carrier === "skt"
        ? discountRules.carrierMembership.skt
        : filter.carrier === "kt"
        ? discountRules.carrierMembership.kt
        : discountRules.carrierMembership.lg;

    // 타입 안전성을 위한 체크 및 멤버십 유효성 확인
    if (
      carrierInfo &&
      typeof carrierInfo === "object" &&
      "enabled" in carrierInfo &&
      carrierInfo.enabled &&
      "discountRate" in carrierInfo &&
      isCarrierMembershipValid(storeId, filter.carrier, carrierInfo, filter)
    ) {
      // carrierInfo를 적절한 타입으로 단언
      const typedCarrierInfo = carrierInfo as CarrierMembershipInfo;

      // 할인액 계산 방식을 매장과 통신사에 따라 다르게 적용
      const carrierDiscountAmount = calculateCarrierDiscountAmount(
        amount,
        storeId,
        filter.carrier,
        typedCarrierInfo.discountRate
      );
      const remainingAmount = amount - carrierDiscountAmount;

      // 카카오페이 굿딜 할인율 설정
      let kakaoPayDiscountRate = discountRules.kakaoPay.discountRate; // 기본값

      // 매장별 카카오페이 굿딜 할인율 설정
      if (storeId === "5") {
        // 메가커피
        kakaoPayDiscountRate = 0.05; // 5%
      } else if (storeId === "1" || storeId === "4") {
        // GS25, 이마트24
        kakaoPayDiscountRate = 0.03; // 3%
      }

      // 카카오페이 굿딜 할인 계산 (남은 금액에 대해)
      const kakaoPayDiscountAmount = remainingAmount * kakaoPayDiscountRate;
      const totalDiscountAmount =
        carrierDiscountAmount + kakaoPayDiscountAmount;

      // restrictions 속성 안전하게 접근
      const restrictions = typedCarrierInfo.restrictions
        ? typedCarrierInfo.restrictions.join(", ")
        : "1일 1회 사용 가능";

      results.push({
        method: `${
          filter.carrier === "skt" ? "T" : filter.carrier === "kt" ? "KT" : "U+"
        } 멤버십 + 카카오페이 굿딜`,
        description: `1,000원당 ${
          typedCarrierInfo.discountRate * 1000
        }원 할인 후 ${kakaoPayDiscountRate * 100}% 추가 할인`,
        originalAmount: amount,
        instantDiscountAmount: totalDiscountAmount,
        pointAmount: 0,
        cashbackAmount: 0,
        totalBenefitAmount: totalDiscountAmount,
        finalAmount: amount - totalDiscountAmount,
        perceivedAmount: amount - totalDiscountAmount,
        discountRate: totalDiscountAmount / amount,
        rank: results.length + 1,
        note: `${restrictions}, 카카오페이 굿딜로 결제 시 추가 할인`,
      });
    }
  }

  // 카카오페이 굿딜 단독 사용
  if (filter.useKakaoPay && discountRules.kakaoPay?.enabled) {
    const kakaoPay = discountRules.kakaoPay;
    let kakaoPayDiscountRate = kakaoPay.discountRate; // 기본값

    // 매장별 카카오페이 굿딜 할인율 설정
    if (storeId === "5") {
      // 메가커피
      kakaoPayDiscountRate = 0.05; // 5%
    } else if (storeId === "1" || storeId === "4") {
      // GS25, 이마트24
      kakaoPayDiscountRate = 0.03; // 3%
    }

    const kakaoPayDiscountAmount = amount * kakaoPayDiscountRate;

    results.push({
      method: "카카오페이 굿딜",
      description: `${kakaoPayDiscountRate * 100}% 할인`,
      originalAmount: amount,
      instantDiscountAmount: kakaoPayDiscountAmount,
      pointAmount: 0,
      cashbackAmount: 0,
      totalBenefitAmount: kakaoPayDiscountAmount,
      finalAmount: amount - kakaoPayDiscountAmount,
      perceivedAmount: amount - kakaoPayDiscountAmount,
      discountRate: kakaoPayDiscountRate,
      rank: results.length + 1,
      note: kakaoPay.restrictions
        ? kakaoPay.restrictions.join(", ")
        : "카카오페이 굿딜로 결제 시 적용",
    });
  }

  // 결과가 없는 경우 (아무 할인도 선택하지 않은 경우)
  if (results.length === 0) {
    results.push({
      method: "할인 없음",
      description: "선택한 할인 수단이 없습니다",
      originalAmount: amount,
      instantDiscountAmount: 0,
      pointAmount: 0,
      cashbackAmount: 0,
      totalBenefitAmount: 0,
      finalAmount: amount,
      perceivedAmount: amount,
      discountRate: 0,
      rank: 1,
    });
  }

  // 할인액 기준으로 내림차순 정렬하고 순위 재할당
  return results
    .sort((a, b) => b.totalBenefitAmount - a.totalBenefitAmount)
    .map((result, index) => ({
      ...result,
      instantDiscountAmount: Math.floor(result.instantDiscountAmount),
      pointAmount: Math.floor(result.pointAmount),
      cashbackAmount: Math.floor(result.cashbackAmount),
      totalBenefitAmount: Math.floor(
        result.instantDiscountAmount +
          result.pointAmount +
          result.cashbackAmount
      ),
      finalAmount: amount - Math.floor(result.instantDiscountAmount),
      perceivedAmount:
        amount -
        Math.floor(
          result.instantDiscountAmount +
            result.pointAmount +
            result.cashbackAmount
        ),
      discountRate:
        Math.floor(
          result.instantDiscountAmount +
            result.pointAmount +
            result.cashbackAmount
        ) / amount,
      rank: index + 1,
    }));
}

/**
 * 통신사 멤버십 할인액을 계산합니다.
 * 메가커피의 T멤버십은 퍼센트 할인, 나머지는 1,000원당 X원 할인 방식을 사용합니다.
 */
function calculateCarrierDiscountAmount(
  amount: number,
  storeId: string,
  carrier: "none" | "skt" | "kt" | "lg",
  discountRate: number
): number {
  // 메가커피의 T멤버십: 단순 20% 할인
  if (storeId === "5" && carrier === "skt") {
    return amount * discountRate;
  }

  // 다른 모든 경우(편의점 등): 1,000원당 X원 할인
  return Math.floor(amount / 1000) * (discountRate * 1000);
}
