import { createContext } from "react";
import type { ReactUseState } from "@pkg/type";

export const SearchColumnContext = createContext<null | ReactUseState<string>>(
  null,
);
