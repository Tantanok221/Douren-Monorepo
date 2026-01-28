import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchColumnContext } from "@lib/ui";

export const SearchColumnSelect = () => {
  const [searchColumn, setSearchColumn] = useSearchColumnContext();

  return (
    <Select value={searchColumn} onValueChange={setSearchColumn}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="搜尋欄位" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>搜尋欄位</SelectLabel>
          <SelectItem value="Author_Main.Author">創作者名稱</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
