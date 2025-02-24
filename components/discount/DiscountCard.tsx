import { IDiscountInfo } from "@/types/discount";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IDiscountCardProps {
  discount: IDiscountInfo;
}

export function DiscountCard({ discount }: IDiscountCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{discount.provider}</span>
          {discount.registrationRequired && (
            <a
              href={discount.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              신청하기
            </a>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="font-medium">{discount.description}</p>
          {discount.conditions.map((condition, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              • {condition}
            </p>
          ))}
          {discount.validTime && (
            <p className="text-sm text-muted-foreground">
              • 이용시간: {discount.validTime}
            </p>
          )}
          {discount.minPurchaseAmount && (
            <p className="text-sm text-muted-foreground">
              • 최소결제금액: {discount.minPurchaseAmount.toLocaleString()}원
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
