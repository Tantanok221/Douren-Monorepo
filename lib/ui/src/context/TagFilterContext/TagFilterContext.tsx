import { ReactNode, useState } from "react";
import {
  TagFilterContext,
  createTagFilterStore,
} from "./TagFilterContextValue.tsx";

interface props {
  allFilter: {
    tag: string | null;
    count: number | null;
    index: number | null;
  }[];
  children: ReactNode;
}

export const TagFilterContextProvider = ({ allFilter, children }: props) => {
  const [store] = useState(() => createTagFilterStore(allFilter));

  return (
    <TagFilterContext.Provider value={store}>
      {children}
    </TagFilterContext.Provider>
  );
};
