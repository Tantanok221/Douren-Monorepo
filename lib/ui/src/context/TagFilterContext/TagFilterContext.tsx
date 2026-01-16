import { createStore, StoreApi } from "zustand";
import { produce } from "immer";
import { createContext, ReactNode, useState } from "react";

interface TagObject {
  //     { tag: '原創', count: 149, index: 0 },
  tag: string | null;
  count: number | null;
  index: number | null;
}

export interface TagFilterStoreTypes {
  allFilter: TagObject[];
  tagFilter: TagObject[];
  checked: boolean[];
  setAllFilter: (data: TagObject[]) => void;
  addTagFilter: (data: TagObject) => void;
  removeTagFilter: (data: TagObject) => void;
  removeAllTagFilter: () => void;
  getTag: (tag: string) => TagObject[];
  setChecked: (index: number, val: boolean) => void;
}

export const TagFilterContext =
  createContext<StoreApi<TagFilterStoreTypes> | null>(null);

interface props {
  allFilter: TagObject[];
  children: ReactNode;
}

export const TagFilterContextProvider = ({ allFilter, children }: props) => {
  const [store] = useState(() => createTagFilterStore(allFilter));

  return (
    <TagFilterContext.Provider value={store}>
      {children}
    </TagFilterContext.Provider>
  );
};

const createTagFilterStore = (allFilter: TagObject[]) =>
  createStore<TagFilterStoreTypes>()((set, get) => ({
    allFilter: allFilter,
    tagFilter: [],
    checked: Array(30).fill(false),
    setAllFilter: async (data: TagObject[]) => {
      set(() => ({ allFilter: data }));
    },
    addTagFilter: (data: TagObject) => {
      set((state) => ({ tagFilter: [...state.tagFilter, data] }));
    },
    removeTagFilter: (data: TagObject) => {
      set((state) => ({
        tagFilter: state.tagFilter.filter((val) => val.tag !== data.tag),
      }));
    },
    removeAllTagFilter: () => {
      set(() => ({ tagFilter: [], checked: Array(30).fill("") }));
    },
    getTag: (tag) => {
      return get().allFilter.filter((val) => val.tag === tag);
    },
    setChecked: (index: number, val: boolean) => {
      set((state) =>
        produce(state, (draftState) => {
          draftState.checked[index] = val;
        }),
      );
    },
  }));
