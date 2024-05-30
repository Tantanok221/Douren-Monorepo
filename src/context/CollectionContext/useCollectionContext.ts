import { useContext } from "react";
import { ActionType, CollectionContext } from "./CollectionContext";
import { ArtistEventType } from "../../types/Artist";

export function useCollectionProvider(): [ArtistEventType[],React.Dispatch<ActionType>] {
  const data = useContext(CollectionContext);
  if(!data ) {
    throw new Error('useCollectionProvider must be used within CollectionProvider');
  }
  return [data.collection,data.dispatch];
}