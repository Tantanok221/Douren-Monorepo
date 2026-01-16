import { createContext } from "react";
import type { ReactUseState } from "@pkg/type";

export const SortSelectContext = createContext<null | ReactUseState<string>>(
  null,
);
