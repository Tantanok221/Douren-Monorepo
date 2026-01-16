import React, { createContext, useState } from "react";
import { ReactUseState } from "@pkg/type";

interface Props {
  children: React.ReactNode;
  defaultValue: string;
}

export const SortSelectContext = createContext<null | ReactUseState<string>>(
  null,
);

export const SortSelectContextProvider = ({
  children,
  defaultValue,
}: Props) => {
  const [sortSelectState, setSortSelectState] = useState(defaultValue);
  return (
    <SortSelectContext.Provider value={[sortSelectState, setSortSelectState]}>
      {children}
    </SortSelectContext.Provider>
  );
};
