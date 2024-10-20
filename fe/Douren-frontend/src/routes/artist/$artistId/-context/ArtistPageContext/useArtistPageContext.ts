import { ArtistPageContext } from "@/routes/artist/$artistId/-context/ArtistPageContext/ArtistPageContext.tsx";
import { useContext } from "react";

export const useArtistPageContext = () => {
  const data = useContext(ArtistPageContext)
  if(!data){
    throw new Error("useArtistPageContext must be used within ArtistPageProvider");
  }
  return data
}