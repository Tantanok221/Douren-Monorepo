import { createContext, useContext } from "react";
import { ArtistFormSchema } from "@/routes/form/artist.tsx";

export const MultiStepFormContext = createContext<MultiStepFormSchema | null>(null)

interface MultiStepFormSchema{
  artistStep: ArtistFormSchema
}


export const useMultiStepFormContext = () => {
  const data = useContext(MultiStepFormContext)
  if(!data) throw new Error("useMultiStepFormContext must be used within context")
  return data
}