import { useEffect } from "react";
import { usePaginationContext } from "../PaginationContext";

export function useUpdatePageSideEffect<T extends React.SetStateAction<any>>(
  func: T,
  dependency: unknown,
) {
  const [page, setPage] = usePaginationContext();
  useEffect(() => {
    setPage(1);
  }, [dependency,setPage]);
  return func;
}
