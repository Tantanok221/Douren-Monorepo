import { usePaginationContext } from "@/context/PaginationContext/usePaginationContext.ts";
import { useEffect } from "react";

export function useUpdatePageSideEffect<T extends React.SetStateAction<any>>(
  func: T,
  dependency: unknown
) {
  const [page, setPage] = usePaginationContext();
  useEffect(() => {
    setPage(1);
  }, [dependency]);
  return func;
}