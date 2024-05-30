import { createContext } from "react";
import { useLocalStorage } from "@mantine/hooks";
import { ArtistEventType } from "../../types/Artist";


interface contextProps {
  collection: ArtistEventType[];
  setCollection: React.Dispatch<React.SetStateAction<ArtistEventType[]>>;
}

export const CollectionContext = createContext<null|contextProps>(null);


type Props = {
  children: React.ReactNode
  key: string
}

export const CollectionContextProvider = ({children,key}: Props) => {
  const [collection, setCollection] = useLocalStorage<ArtistEventType[] >({
    key: key,
    defaultValue: [] 
  }); 
  return (
    <CollectionContext.Provider value={{collection,setCollection}}>{children}</CollectionContext.Provider>
  )
}

