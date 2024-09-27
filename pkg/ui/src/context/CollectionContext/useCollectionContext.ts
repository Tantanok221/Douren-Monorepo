import { useContext } from "react";
import { ActionType, CollectionContext } from "./index.tsx";
import { ArtistEventType } from "@/types/Artist.ts";

export function useCollectionProvider(): [ArtistEventType[]|null,React.Dispatch<ActionType>] {
  const data = useContext(CollectionContext);
  if(!data ) {
    throw new Error('useCollectionProvider must be used within CollectionProvider');
  }
  return [data.collection,data.dispatch];
}