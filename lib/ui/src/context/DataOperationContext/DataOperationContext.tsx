import { SortSelectContextProvider } from "../SortSelectContext";
import { SearchColumnContextProvider } from "../SearchColumnContext";
import { PaginationContextProvider } from "../PaginationContext";
import { SearchContextProvider } from "../SearchContext";
import { TagFilterContextProvider } from "../TagFilterContext";
import { TagObject } from "../../stores";

interface Prop {
  children: React.ReactNode;
  tag: TagObject[] | undefined
}

export const DataOperationProvider = ({ tag,children }: Prop) => {
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
