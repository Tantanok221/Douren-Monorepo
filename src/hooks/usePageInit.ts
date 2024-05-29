import { useEffect } from "react";
import { useTagFilter } from "./useTagFilter";
import { useNextPageAvailable } from "./useNextPageAvailable";
import { useCollection } from "./useCollection";

export function usePageInit(){
  const setAllFilter = useTagFilter((state) => state.setAllFilter);
  const initNextPageAvailable = useNextPageAvailable(
    (state) => state.initNextPageAvailable,
  );
  const initCollection = useCollection((state) => state.initCollection);
  useEffect(() => {
    setAllFilter();
    initNextPageAvailable();
    initCollection();
  }, []);
}