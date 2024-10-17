import { useContext } from "react";
import { ActionType, CollectionContext } from "./CollectionContext.tsx";
import { eventArtistBaseSchemaType } from "@pkg/type";

export function useCollectionProvider(): [
  eventArtistBaseSchemaType[] | null,
  React.Dispatch<ActionType>,
] {
  const data = useContext(CollectionContext);
  if (!data) {
    throw new Error(
      "useCollectionProvider must be used within CollectionProvider",
    );
  }
  return [data.collection, data.dispatch];
}
