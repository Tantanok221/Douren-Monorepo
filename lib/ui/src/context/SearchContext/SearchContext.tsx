import { useState } from "react";
import { SearchContext } from "./SearchContextValue.tsx";

interface Props {
  children: React.ReactNode;
  defaultValue: string;
}

export const SearchContextProvider = ({ children, defaultValue }: Props) => {
  const [sortSelectState, setSortSelectState] = useState(defaultValue);
  return (
    <SearchContext.Provider value={[sortSelectState, setSortSelectState]}>
      {children}
    </SearchContext.Provider>
  );
};
