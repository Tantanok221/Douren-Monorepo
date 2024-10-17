import { useContext } from "react";
import { SearchColumnContext } from "./SearchColumnContext";

export function useSearchColumnContext() {
  const data = useContext(SearchColumnContext);
  if (!data)
    throw new Error(
      "useSearchColumnContext must be use within SearchColumnContext",
    );
  return data;
}
