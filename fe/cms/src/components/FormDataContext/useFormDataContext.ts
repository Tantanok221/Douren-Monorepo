import { FormDataContext, FormDataState } from "./FormDataContext.tsx";
import { useContext } from "react";
import { useStore } from "zustand";

export function useFormDataContext<U>(selector: (state: FormDataState) => U) {
  const store = useContext(FormDataContext);
  if (!store) throw new Error("useFormDataContext must be used within context");
  return useStore(store, selector);
}

/**
 * Returns the raw Zustand store for direct state access.
 * Use this when you need to read fresh state at execution time (e.g., in async callbacks)
 * rather than relying on React's render cycle.
 */
export function useFormDataStore() {
  const store = useContext(FormDataContext);
  if (!store) throw new Error("useFormDataStore must be used within context");
  return store;
}
