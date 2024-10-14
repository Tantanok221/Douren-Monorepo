import { PaginationContextProvider } from "@/context/PaginationContext/PaginationContext.tsx";
import { SearchColumnContextProvider } from "@/context/SearchColumnContext/SearchColumnContext.tsx";
import { SortSelectContextProvider } from "@/context/SortSelectContext/SortSelectContext.tsx";
import { createContext, useEffect } from "react";
import { usePaginationContext } from "@/context/PaginationContext/usePaginationContext.ts";
import { useSortSelectContext } from "@/context/SortSelectContext/useSortSelectContext.ts";
import { useSearchColumnContext } from "@/context/SearchColumnContext/useSearchColumnContext.ts";
import { useSearchContext } from "@/context/SearchContext/useSearchContextProvider.ts";
import { SearchContextProvider } from "@/context/SearchContext/SearchContext.tsx";

interface Prop {
  children: React.ReactNode;
}



export function useUpdatePageSideEffect<T extends React.SetStateAction<any>>(func :T, dependency: unknown ) {
  const [page, setPage] = usePaginationContext();
  useEffect(() => {
      setPage(1);
  }, [dependency]);
  return func
}

export const DataOperationProvider = ({ children }: Prop) => {
  return (
    <SortSelectContextProvider defaultValue="Author_Main(Author),asc">
      <SearchColumnContextProvider defaultValue="Booth_name">
        <PaginationContextProvider defaultValue={1}>
          <SearchContextProvider defaultValue={""}>
            {children}
          </SearchContextProvider>
        </PaginationContextProvider>
      </SearchColumnContextProvider>
    </SortSelectContextProvider>
  );
};
