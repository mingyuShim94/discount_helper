import { IDiscountInfo } from "@/types/discount";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface IDiscountCardProps {
  discount: IDiscountInfo;
}

export function DiscountCard({ discount }: IDiscountCardProps) {
  const handleCardClick = () => {
    if (discount.registrationLink) {
      window.open(discount.registrationLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      onClick={discount.registrationLink ? handleCardClick : undefined}
      className={`${
        discount.registrationLink
          ? "cursor-pointer hover:opacity-80 transition-opacity"
          : ""
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
