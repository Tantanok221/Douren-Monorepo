import { createContext } from "react";
import type { ReactUseState } from "@pkg/type";

export const SearchContext = createContext<null | ReactUseState<string>>(null);
