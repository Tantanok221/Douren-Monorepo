import { PaginationContextProvider } from "@/context/PaginationContext/PaginationContext.tsx";
import { SearchColumnContextProvider } from "@/context/SearchColumnContext/SearchColumnContext.tsx";
import { SortSelectContextProvider } from "@/context/SortSelectContext/SortSelectContext.tsx";
import { SearchContextProvider } from "@/context/SearchContext/SearchContext.tsx";

interface Prop {
  children: React.ReactNode;
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
