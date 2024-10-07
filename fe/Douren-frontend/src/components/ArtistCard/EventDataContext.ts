import { createContext, useContext } from "react";
import { eventArtistBaseSchemaType } from "../../types/Artist";

const EventDataContext = createContext<undefined | eventArtistBaseSchemaType>(
  undefined,
);

export function useEventDataContext() {
  const context = useContext(EventDataContext);

  return context;
}

export default EventDataContext;
