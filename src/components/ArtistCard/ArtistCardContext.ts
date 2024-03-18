import { createContext, useContext } from "react";
import { ArtistTypes } from "../../../types/Artist";

const ArtistCardContext = createContext<undefined | ArtistTypes>(undefined);

export function useArtistCardContext() {
  const context = useContext(ArtistCardContext);
  if (!context) {
    throw new Error(
      "useArtistCardContext must be used within a ArtistCardContextProvider"
    );
  }
  return context;
}

export default ArtistCardContext;
