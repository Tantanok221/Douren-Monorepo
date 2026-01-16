import { createContext } from "react";
import type { ReactUseState } from "@pkg/type";

export const PaginationContext = createContext<null | ReactUseState<number>>(
  null,
);
