import React, { createContext, useState } from "react";
import { ReactUseState } from "@pkg/type";

interface Props {
  children: React.ReactNode;
  defaultValue: string;
}

export const SearchContext = createContext<null | ReactUseState<string>>(null);

export const SearchContextProvider = ({ children, defaultValue }: Props) => {
  const [sortSelectState, setSortSelectState] = useState(defaultValue);
  return (
    <SearchContext.Provider value={[sortSelectState, setSortSelectState]}>
      {children}
    </SearchContext.Provider>
  );
};
