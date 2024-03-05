import { createContext, useContext } from "react";
import { FF } from "../../../types/FF";

const ArtistCardContext = createContext<undefined | FF>(undefined);

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
