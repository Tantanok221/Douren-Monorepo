import { createContext, useContext } from "react";
import { OldFF } from '../../../types/OldFF';

const ArtistCardContext = createContext<undefined|OldFF>(undefined)

export function useArtistCardContext(){
  const context = useContext(ArtistCardContext)
  if(!context){
    throw new Error('useArtistCardContext must be used within a ArtistCardContextProvider')
  }
  return context
}

export default ArtistCardContext