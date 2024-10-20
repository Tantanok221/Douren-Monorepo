import { ArtistPageTypes } from "@/types";
import { createContext, ReactNode } from "react";

export const ArtistPageContext = createContext<ArtistPageTypes | null>(null);

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
