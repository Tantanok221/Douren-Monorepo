import { useContext } from "react";
import { SearchContext } from "./SearchContext.tsx";

export function useSearchContext() {
  const data = useContext(SearchContext);
  if (!data)
    throw new Error("useSearchContext must be use within SearchContext");
  return data;
}
