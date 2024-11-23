import { createStore, StoreApi } from "zustand";
import { LinkTypeKeys } from "../type";
import { createContext, useState } from "react";

interface LinkField {
  LinkType: LinkTypeKeys[];
  AddLinkType: (linkType: LinkTypeKeys) => void;
  RemoveLinkType: (linkType: LinkTypeKeys) => void;
}

interface props{
  children: React.ReactNode;
}

const createLinkFilterStore = () => createStore<LinkField>()((set) => ({
  LinkType: [] as LinkTypeKeys[],
  AddLinkType: (linkType) => {
    set((state) => ({ LinkType: [...state.LinkType, linkType] }));
  },
  RemoveLinkType: (linkType) => {
    set((state) => ({ LinkType: state.LinkType.filter(type => type != linkType) }));
  }
}));

export const LinkFilterStoreContext = createContext<StoreApi<LinkField>| null>(null)

export const LinkFilterStoreContextProvider = ({children}: props) => {
  const [store] = useState(() => createLinkFilterStore())
  return (
    <LinkFilterStoreContext.Provider value={store}>
      {children}
    </LinkFilterStoreContext.Provider>
  )
}