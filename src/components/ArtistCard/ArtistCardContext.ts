import { createContext, useContext } from "react";
import { ArtistTypes } from "../../../types/Artist";

const ArtistCardContext = createContext<undefined | ArtistTypes>(undefined);

export function useArtistCardContext() {
  const context = useContext(ArtistCardContext);
  
  return context;
}

export default ArtistCardContext;
