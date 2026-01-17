import { ArtistPageTypes } from "@/types";
import { ReactNode } from "react";
import { ArtistPageContext } from "./context";

type Props = {
  children: ReactNode;
  data: ArtistPageTypes;
};

export const ArtistPageProvider = ({ children, data }: Props) => {
  return (
    <ArtistPageContext.Provider value={data}>
      {children}
    </ArtistPageContext.Provider>
  );
};

// Re-export context for convenience
export { ArtistPageContext } from "./context";
