import { createContext, useContext } from "react";
import {eventArtistBaseSchemaType } from "@pkg/type";

const EventDataContext = createContext<undefined | eventArtistBaseSchemaType>(undefined);

export function useEventDataContext() {
  const context = useContext(EventDataContext);

  return context;
}

export default EventDataContext;
