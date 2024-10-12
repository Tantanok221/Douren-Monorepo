import { createContext, useContext } from "react";
import {
  artistBaseSchemaWithTagType,
  eventArtistBaseSchemaType
} from "@pkg/type";

const EventDataContext = createContext<undefined | eventArtistBaseSchemaType |artistBaseSchemaWithTagType>(undefined);

export function useEventDataContext() {
  const context = useContext(EventDataContext);
  if(!context){
    throw new Error("useEventDataContext must be used within EventDataContext");
  }
  return context;
}

export default EventDataContext;
