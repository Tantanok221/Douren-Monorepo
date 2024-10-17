import { SortSelectContextProvider } from "../SortSelectContext";
import { SearchColumnContextProvider } from "../SearchColumnContext";
import { PaginationContextProvider } from "../PaginationContext";
import { SearchContextProvider } from "../SearchContext";

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
