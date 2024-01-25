import { createContext, useContext } from "react";


const ArtistCardContext = createContext(undefined)

export function useArtistCardContext(){
  const context = useContext(ArtistCardContext)
  if(!context){
    throw new Error('useArtistCardContext must be used within a ArtistCardContextProvider')
  }
  return context
}

export default ArtistCardContext