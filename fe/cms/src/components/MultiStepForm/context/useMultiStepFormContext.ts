import { createContext, useContext } from "react";
import { StoreApi, useStore } from "zustand";
import { MultiStepStore } from "./MultiStepFormContext.tsx";

export const MultiStepFormContext =
  createContext<StoreApi<MultiStepStore> | null>(null);

export function useMultiStepFormContext<U>(
  selector: (state: MultiStepStore) => U,
) {
  const state = useContext(MultiStepFormContext);
  if (!state)
    throw new Error("useMultiStepFormContext must be used within context");
  return useStore(state, selector);
}
