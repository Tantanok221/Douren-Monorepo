import { useContext } from "react";
import { CollectionContext } from "./CollectionContext";

export function useCollectionProvider()  {
  const data = useContext(CollectionContext);
  if(!data ) {
    throw new Error('useCollectionProvider must be used within CollectionProvider');
  }
  return data;
}