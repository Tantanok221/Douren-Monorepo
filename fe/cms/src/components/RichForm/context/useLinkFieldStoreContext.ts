import { useContext } from "react";
import { LinkFilterStoreContext } from "./LinkFieldStoreContext.tsx";

export const useLinkFieldStoreContext = () => {
  const data = useContext(LinkFilterStoreContext)
  if (!data) throw new Error("useLinkFieldStoreContext must be used within the context")
  return data
}