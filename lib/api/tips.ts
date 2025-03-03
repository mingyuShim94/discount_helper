import { ITip } from "@/types/tip";

// 임시 데이터
export const mockTips: ITip[] = [
  {
    id: "1",
    title: "이마트24 5000원 이상 결제시 최대 20% 할인받는 방법",
    slug: "emart24-discount-tips",
    excerpt:
      "이마트24에서 5000원 이상 결제한다면 네이버페이 쿠폰을 활용해 최대 20%까지 할인받는 방법을 알아보세요.",
    content: `
      <h2>이마트24 5000원 이상 결제시 최대 20% 할인받는 방법</h2>
      <p>이마트24에서 쇼핑할 때 네이버페이 쿠폰을 활용하면 최대 20%까지 할인을 받을 수 있습니다. 아래 방법을 따라해보세요.</p>
      
      <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
        <div class="flex items-center gap-2">
          <span class="text-yellow-600 text-xl">💰</span>
          <h3 class="font-bold text-lg text-yellow-800">할인 요약</h3>
        </div>
        <p class="mt-2">5000원 결제 시 1000원 할인 (20% 할인 효과)</p>
      </div>
      
      <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center">1</span>
        네이버페이 쿠폰 받는 방법
      </h3>
      
      <div class="space-y-6 my-8">
        <!-- 첫 번째 단계 -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-start gap-3">
            <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">1</div>
            <div>
              <h4 class="font-medium text-xl mb-2">네이버페이 앱 실행하기</h4>
              <p class="mb-5 text-base text-gray-700">스마트폰에서 네이버페이 앱을 실행합니다. 앱이 없다면 앱스토어나 플레이스토어에서 다운로드하세요.</p>
              <div class="flex justify-center">
                <img 
                  src="/images/tips/emart24-tip-1.png" 
                  alt="네이버페이 앱 클릭" 
                  class="rounded-lg shadow-md border border-gray-200 w-full max-w-[300px]" 
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- 두 번째 단계 -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-start gap-3">
            <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">2</div>
            <div>
              <h4 class="font-medium text-xl mb-2">쿠폰 메뉴로 이동하기</h4>
              <p class="mb-5 text-base text-gray-700">네이버페이 앱에서 쿠폰 메뉴를 클릭하고, 아래로 스크롤하여 현장결제쿠폰받기 버튼을 찾아 클릭합니다.</p>
              <div class="flex justify-center">
                <img 
                  src="/images/tips/emart24-tip-2.png" 
                  alt="쿠폰 클릭 및 현장결제쿠폰받기" 
                  class="rounded-lg shadow-md border border-gray-200 w-full max-w-[300px]" 
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- 세 번째 단계 -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-start gap-3">
            <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">3</div>
            <div>
              <h4 class="font-medium text-xl mb-2">이마트24 쿠폰 찾기</h4>
              <p class="mb-5 text-base text-gray-700">생활 카테고리를 클릭하고 이마트24를 찾아 클릭합니다. 5000원 이상 결제시 1000원 할인 쿠폰의 '받기' 버튼을 클릭하세요.</p>
              <div class="flex justify-center">
                <img 
                  src="/images/tips/emart24-tip-3.png" 
                  alt="생활 클릭 및 이마트24 쿠폰 받기" 
                  class="rounded-lg shadow-md border border-gray-200 w-full max-w-[300px]" 
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- 네 번째 단계 -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-start gap-3">
            <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">4</div>
            <div>
              <h4 class="font-medium text-xl mb-2">쿠폰함에서 확인하기</h4>
              <p class="mb-5 text-base text-gray-700">쿠폰을 받은 후 쿠폰함에서 발급된 쿠폰을 확인할 수 있습니다. 이제 이마트24에서 사용할 준비가 되었습니다.</p>
              <div class="flex justify-center">
                <img 
                  src="/images/tips/emart24-tip-4.png" 
                  alt="쿠폰함에 쿠폰 확인" 
                  class="rounded-lg shadow-md border border-gray-200 w-full max-w-[300px]" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
        <span class="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center">2</span>
        쿠폰 사용 방법
      </h3>
      
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 my-6">
        <ol class="space-y-4">
          <li class="flex items-start gap-3">
            <div class="bg-green-500 text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-1 text-sm">1</div>
            <div>
              <p class="font-medium">결제하려는 상품 바코드를 찍습니다.</p>
              <p class="text-sm text-red-600 mt-1">주의: 총 금액이 5000원 이상이어야 합니다!</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <div class="bg-green-500 text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-1 text-sm">2</div>
            <p>상품을 다 찍은 후, 네이버페이 쿠폰함에 있는 쿠폰 바코드를 보여주세요.</p>
          </li>
          <li class="flex items-start gap-3">
            <div class="bg-green-500 text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-1 text-sm">3</div>
            <p>결제를 완료합니다. (네이버페이로 결제하지 않아도 쿠폰 할인은 적용됩니다)</p>
          </li>
        </ol>
      </div>
      
      <div class="bg-blue-50 p-6 rounded-lg shadow-sm my-6 border border-blue-100">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-blue-600 text-xl">💡</span>
          <p class="font-bold text-lg">꿀팁</p>
        </div>
        <p class="text-base">5000원 결제 시 1000원 할인은 20% 할인 효과가 있습니다. 정확히 5000원어치 상품을 구매하면 할인 효과를 극대화할 수 있어요!</p>
      </div>
    `,
    publishedAt: new Date(2025, 2, 3, 9, 0, 0).toISOString(),
    author: "할인도우미",
    tags: ["이마트24", "할인", "네이버페이", "쿠폰", "편의점"],
  },
];

export async function getTips(): Promise<ITip[]> {
  // 실제 구현에서는 DB나 외부 API에서 데이터를 가져올 수 있습니다
  return mockTips;
}

export async function getTipBySlug(slug: string): Promise<ITip | null> {
  // 실제 구현에서는 DB나 외부 API에서 데이터를 가져올 수 있습니다
  const tip = mockTips.find((tip) => tip.slug === slug);
  return tip || null;
}
