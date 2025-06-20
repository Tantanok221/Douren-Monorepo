import {FormDataContext, FormDataState} from "./FormDataContext.tsx";
import {useContext} from "react";
import {useStore} from "zustand";

export function useFormDataContext<U>(
  selector: (state: FormDataState) => U,
) {
  const state = useContext(FormDataContext);
  if (!state)
    throw new Error("useFormDataContext must be used within context");
  return useStore(state, selector);
}
