import React, { createContext, useState } from "react";
import { ReactUseState } from "@pkg/type";

interface Props {
  children: React.ReactNode;
  defaultValue: number;
}

export const PaginationContext = createContext<null | ReactUseState<number>>(
  null,
);

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
