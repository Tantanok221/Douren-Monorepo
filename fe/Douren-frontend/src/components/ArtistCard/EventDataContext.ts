import { createContext, useContext } from "react";
import { ArtistEventType } from "../../types/Artist";

const EventDataContext = createContext<undefined | ArtistEventType>(undefined);

export function useEventDataContext() {
  const context = useContext(EventDataContext);

  return context;
}

export default EventDataContext;
