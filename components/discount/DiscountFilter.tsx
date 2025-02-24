import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface IDiscountFilter {
  carrier: string;
  useNaverPay: boolean;
  useNaverMembership: boolean;
}

interface DiscountFilterProps {
  filter: IDiscountFilter;
  onFilterChange: (filter: IDiscountFilter) => void;
}

export function DiscountFilter({
  filter,
  onFilterChange,
}: DiscountFilterProps) {
  useEffect(() => {
    onFilterChange(filter);
  }, [filter, onFilterChange]);

  const handleChange = (changes: Partial<IDiscountFilter>) => {
    const newFilter = { ...filter, ...changes };
    onFilterChange(newFilter);
  };

  return (
    <div className="space-y-6 p-4 bg-card rounded-lg mb-6">
      <div className="space-y-2">
        <Label>통신사 멤버십 선택</Label>
        <Select
          value={filter.carrier}
          onValueChange={(value) => handleChange({ carrier: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="통신사멥버십을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">없음</SelectItem>
            <SelectItem value="skt">SKT멤버십</SelectItem>
            <SelectItem value="kt">KT멤버십</SelectItem>
            <SelectItem value="lg">LGU+멤버십</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="naverpay"
            checked={filter.useNaverPay}
            onCheckedChange={(checked) =>
              handleChange({ useNaverPay: checked })
            }
          />
          <Label htmlFor="naverpay">네이버페이 사용</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="navermembership"
            checked={filter.useNaverMembership}
            onCheckedChange={(checked) =>
              handleChange({ useNaverMembership: checked })
            }
          />
          <Label htmlFor="navermembership">네이버 멤버십 보유</Label>
        </div>
      </div>
    </div>
  );
}
