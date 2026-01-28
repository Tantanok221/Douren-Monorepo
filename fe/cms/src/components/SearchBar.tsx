import { useEffect, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@mantine/hooks";
import { usePaginationContext, useSearchContext } from "@lib/ui";

export const SearchBar = () => {
  const [bufferSearch, setBufferSearch] = useState("");
  const [debounceSearch] = useDebouncedValue(bufferSearch, 500);
  const [, setSearch] = useSearchContext();
  const [, setPage] = usePaginationContext();

  useEffect(() => {
    setPage(1);
    setSearch(debounceSearch);
  }, [debounceSearch, setPage, setSearch]);

  return (
    <div className="relative w-full">
      <MagnifyingGlass
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={20}
      />
      <Input
        type="text"
        placeholder="搜尋社團/作者名字"
        value={bufferSearch}
        onChange={(e) => setBufferSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};
