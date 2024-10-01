import { useContext } from "react";
import { ActionType, CollectionContext } from "./index.tsx";
import {eventArtistSchemaType} from "@pkg/type";

export function useCollectionProvider(): [eventArtistSchemaType[]|null,React.Dispatch<ActionType>] {
  const data = useContext(CollectionContext);
  if(!data ) {
    throw new Error('useCollectionProvider must be used within CollectionProvider');
  }
  return [data.collection,data.dispatch];
}