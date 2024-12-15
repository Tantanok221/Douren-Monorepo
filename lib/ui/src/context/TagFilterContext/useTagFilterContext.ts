import { useContext } from "react";
import { useStore } from "zustand/index";
import { TagFilterContext, TagFilterStoreTypes } from "./TagFilterContext.tsx";

export function useTagFilterContext<U>(
  selector: (state: TagFilterStoreTypes) => U,
) {
  const store = useContext(TagFilterContext);
  if (!store)
    throw new Error(
      "useTagFilterContext should be used within TagFilterContext",
    );
  return useStore(store, selector);
}
