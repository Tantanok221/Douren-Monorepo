import { createContext, ReactNode } from "react";

type RefreshFunc = () => void;

export const RefreshHelperContext = createContext<RefreshFunc | null>(null);
