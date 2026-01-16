import { useState } from "react";
import { SearchColumnContext } from "./SearchColumnContextValue.tsx";

interface Props {
  children: React.ReactNode;
  defaultValue: string;
}

export const SearchColumnContextProvider = ({
  defaultValue,
  children,
}: Props) => {
  const [searchColumn, setSearchColumn] = useState(defaultValue);
  return (
    <SearchColumnContext.Provider value={[searchColumn, setSearchColumn]}>
      {children}
    </SearchColumnContext.Provider>
  );
};
