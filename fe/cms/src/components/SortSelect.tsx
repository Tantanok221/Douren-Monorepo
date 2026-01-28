import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSortSelectContext, useUpdatePageSideEffect } from "@lib/ui";

interface SortItem {
  text: string;
  value: string;
}

interface Props {
  sortItems: SortItem[];
}

export const SortSelect = ({ sortItems }: Props) => {
  const [sortValue, setSortValue] = useSortSelectContext();

  return (
    <Select
      value={sortValue}
      onValueChange={useUpdatePageSideEffect(setSortValue, sortValue)}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="排序方式" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>排序方式</SelectLabel>
          {sortItems.map((item) => (
            <SelectItem key={item.value + ",asc"} value={item.value + ",asc"}>
              {item.text}(順序)
            </SelectItem>
          ))}
          {sortItems.map((item) => (
            <SelectItem key={item.value + ",desc"} value={item.value + ",desc"}>
              {item.text}(逆序)
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
