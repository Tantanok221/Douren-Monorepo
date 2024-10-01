import { createContext, useContext } from "react";
import {eventArtistSchemaType} from "@pkg/type";

const EventDataContext = createContext<undefined | eventArtistSchemaType>(undefined);

export function useEventDataContext() {
  const context = useContext(EventDataContext);

  return context;
}

export default EventDataContext;
