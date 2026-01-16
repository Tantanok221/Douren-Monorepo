import { useState } from "react";
import { SortSelectContext } from "./SortSelectContextValue.tsx";

interface Props {
  children: React.ReactNode;
  defaultValue: string;
}

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
