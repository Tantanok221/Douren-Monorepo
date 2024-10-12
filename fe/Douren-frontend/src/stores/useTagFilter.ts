import {create} from "zustand";
import {supabase} from "../helper/supabase";
import {produce} from "immer";

//     { tag: '原創', count: 149, index: 0 },

export interface TagObject {
  tag: string;
  count: number | null;
  index: number;
}

interface TagFilter {
  allFilter: TagObject[];
  tagFilter: TagObject[];
  checked: boolean[];
  setAllFilter: (data: TagObject[] ) => void;
  addTagFilter: (data: TagObject) => void;
  removeTagFilter: (data: TagObject) => void;
  removeAllTagFilter: () => void;
  getTag: (tag: string) => TagObject[];
  setChecked: (index: number, val: boolean) => void;
}

export const useTagFilter = create<TagFilter>()((set, get) => ({
  allFilter: [],
  tagFilter: [],
  checked: Array(30).fill(""),
  setAllFilter: (data: TagObject[] ) => {
      set(() => ({allFilter: data}));
  },
  addTagFilter: (data: TagObject) => {
    console.log(data)
    set((state) => ({tagFilter: [...state.tagFilter, data]}));
  },
  removeTagFilter: (data: TagObject) => {
    set((state) => ({
      tagFilter: state.tagFilter.filter((val) => val !== data),
    }));
  },
  removeAllTagFilter: () => {
    set(() => ({tagFilter: [], checked: Array(30).fill("")}));
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
