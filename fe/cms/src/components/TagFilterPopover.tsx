import { useEffect } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { usePaginationContext, useTagFilterContext, TagObject } from "@lib/ui";
import { cn } from "@/lib/utils";

interface TagItemProps {
  data: TagObject;
  index: number;
}

const TagItem = ({ data, index }: TagItemProps) => {
  const { tag } = data;
  const addTagFilter = useTagFilterContext((state) => state.addTagFilter);
  const removeTagFilter = useTagFilterContext((state) => state.removeTagFilter);
  const checked = useTagFilterContext((state) => state.checked);
  const setChecked = useTagFilterContext((state) => state.setChecked);

  return (
    <div className="flex items-center space-x-2">
      <Checkbox.Root
        id={`tag-${index}`}
        checked={checked[index]}
        onCheckedChange={(check: boolean) => {
          setChecked(index, check);
          if (check) {
            addTagFilter(data);
          } else {
            removeTagFilter(data);
          }
        }}
        className={cn(
          "h-4 w-4 shrink-0 rounded-sm border border-stone-200 bg-white shadow-sm",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-950",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:bg-stone-900 data-[state=checked]:text-stone-50",
          "dark:border-stone-800 dark:bg-stone-950",
          "dark:focus-visible:ring-stone-300",
          "dark:data-[state=checked]:bg-stone-50 dark:data-[state=checked]:text-stone-900"
        )}
      >
        <Checkbox.Indicator className="flex items-center justify-center text-current">
          <Check className="h-3 w-3" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label
        htmlFor={`tag-${index}`}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
      >
        {tag}
      </label>
    </div>
  );
};

export const TagFilterPopover = () => {
  const allFilter = useTagFilterContext((state) => state.allFilter);
  const tagFilter = useTagFilterContext((state) => state.tagFilter);
  const [, setPage] = usePaginationContext();

  useEffect(() => {
    setPage(1);
  }, [setPage, tagFilter]);

  if (!allFilter) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-between">
          <span>
            標簽:
            {tagFilter.length === 0 && " 全部"}
            {tagFilter.length <= 3 && tagFilter.length !== 0 && (
              <span className="ml-1">
                {tagFilter.map((item) => item.tag).join(", ")}
              </span>
            )}
            {tagFilter.length > 3 && ` ${tagFilter.length} 個標簽`}
          </span>
          <CaretDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[300px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium leading-none">選擇標簽</h4>
            {tagFilter.length > 0 && (
              <Badge variant="secondary">{tagFilter.length} 已選</Badge>
            )}
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {allFilter.map((item) => {
              if (!item.index) return null;
              return <TagItem key={item.tag} data={item} index={item.index} />;
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
