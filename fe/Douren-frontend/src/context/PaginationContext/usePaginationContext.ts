import { useContext } from "react";
import { PaginationContext } from "./PaginationContext.tsx";

export const usePaginationContext = () => {
  const data = useContext(PaginationContext);
  if (!data)
    throw new Error(
      "usePaginationContext must be used within PaginationContext",
    );
  return data;
};
