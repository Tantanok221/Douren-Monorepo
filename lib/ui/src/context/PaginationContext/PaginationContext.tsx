import { useState } from "react";
import { PaginationContext } from "./PaginationContextValue.tsx";

interface Props {
  children: React.ReactNode;
  defaultValue: number;
}

export const PaginationContextProvider = ({
  children,
  defaultValue,
}: Props) => {
  const [sortSelectState, setSortSelectState] = useState(defaultValue);
  return (
    <PaginationContext.Provider value={[sortSelectState, setSortSelectState]}>
      {children}
    </PaginationContext.Provider>
  );
};
