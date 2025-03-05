import { IDiscountInfo, DiscountType } from "@/types/discount";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface IDiscountCardProps {
  discount: IDiscountInfo;
}

export function DiscountCard({ discount }: IDiscountCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    // 카카오페이 할인 정보인 경우 팁 페이지로 이동
    if (
      discount.type === DiscountType.KAKAOPAY &&
      discount.tipLinks &&
      discount.tipLinks.length > 0
    ) {
      router.push(discount.tipLinks[0].url);
      return;
    }

    // 기존 로직: 등록 링크가 있는 경우 해당 링크로 이동
    if (discount.registrationLink) {
      window.open(discount.registrationLink, "_blank", "noopener,noreferrer");
    }
  };

  // 카드가 클릭 가능한지 여부 확인
  const isClickable =
    discount.registrationLink ||
    (discount.type === DiscountType.KAKAOPAY &&
      discount.tipLinks &&
      discount.tipLinks.length > 0);

  return (
    <div
      onClick={isClickable ? handleCardClick : undefined}
      className={`${
        isClickable ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
      }`}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{discount.title}</span>
            {discount.registrationLink && (
              <span className="text-sm text-primary flex items-center gap-1">
                <ExternalLink size={16} />
                신청하기
              </span>
            )}
            {discount.type === DiscountType.KAKAOPAY &&
              discount.tipLinks &&
              discount.tipLinks.length > 0 && (
                <span className="text-sm text-primary flex items-center gap-1">
                  <HelpCircle size={16} />
                  할인방법 보기
                </span>
              )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="font-medium">{discount.description}</p>
            <p className="text-sm text-muted-foreground">
              • {discount.conditions}
            </p>
            {discount.validUntil && (
              <p className="text-sm text-muted-foreground">
                • 유효기간: {discount.validUntil}
              </p>
            )}

            {discount.tipLinks && discount.tipLinks.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium flex items-center gap-1">
                  <HelpCircle size={16} />
                  쿠폰 찾는 방법
                </p>
                <div className="flex flex-wrap gap-2">
                  {discount.tipLinks.map((tip, index) => (
                    <Link
                      key={index}
                      href={tip.url}
                      onClick={(e) => e.stopPropagation()}
                      className="cursor-pointer"
                    >
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-white text-primary border border-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
                      >
                        {tip.title}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
