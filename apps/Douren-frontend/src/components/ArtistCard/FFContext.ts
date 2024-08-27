import { createContext, useContext } from "react";
import { FF } from "../../types/FF";
import { ArtistTypes } from "../../types/Artist";

const FFContext = createContext<undefined | FF>(undefined);

export function useFFContext() {
  const context = useContext(FFContext);

  return context;
}

export default FFContext;
