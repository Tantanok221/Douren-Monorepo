import { SortSelectContextProvider } from "../SortSelectContext";
import { SearchColumnContextProvider } from "../SearchColumnContext";
import { PaginationContextProvider } from "../PaginationContext";
import { SearchContextProvider } from "../SearchContext";
import { TagFilterContextProvider } from "../TagFilterContext";
import { useFetchTagData } from "doujinbooth/src/hooks";

interface Prop {
  children: React.ReactNode;
}

export const DataOperationProvider = ({ children }: Prop) => {
  const tag = useFetchTagData();
  if (!tag) return null;
  return (
    <SortSelectContextProvider defaultValue="Author_Main(Author),asc">
      <SearchColumnContextProvider defaultValue="Booth_name">
        <TagFilterContextProvider allFilter={tag}>
          <PaginationContextProvider defaultValue={1}>
            <SearchContextProvider defaultValue={""}>
              {children}
            </SearchContextProvider>
          </PaginationContextProvider>
        </TagFilterContextProvider>
      </SearchColumnContextProvider>
    </SortSelectContextProvider>
  );
};
