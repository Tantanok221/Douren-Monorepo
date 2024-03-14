import { createContext, useContext } from "react";
import { ArtistTypes } from "../../../types/Artist";

const ArtistCardSmallContext = createContext<undefined | ArtistTypes>(undefined);

export function useArtistCardSmallContext() {
  const context = useContext(ArtistCardSmallContext);
  if (!context) {
    throw new Error(
      "useArtistCardSmallContext must be used within a ArtistCardContextProvider"
    );
  }
  return context;
}

export default ArtistCardSmallContext;
