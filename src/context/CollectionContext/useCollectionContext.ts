import { useContext } from "react";
import { CollectionContext } from "./CollectionContext";

export function useCollectionProvider()  {
  if(!CollectionContext ) {
    throw new Error('useCollectionProvider must be used within CollectionProvider');
  }
  return useContext(CollectionContext);
}