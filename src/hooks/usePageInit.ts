import { useEffect } from "react";
import { useTagFilter } from "../stores/useTagFilter";
import { useNextPageAvailable } from "../stores/useNextPageAvailable";
import { useLocation } from "react-router";

export function usePageInit() {
  const setAllFilter = useTagFilter((state) => state.setAllFilter);
  const initNextPageAvailable = useNextPageAvailable(
    (state) => state.initNextPageAvailable,
  );
  const location = useLocation();
  useEffect(() => {
    setAllFilter();
    initNextPageAvailable();
  }, []);
}
