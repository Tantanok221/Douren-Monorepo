import { create } from "zustand";
import { produce } from "immer";
import { z } from "zod";

//     { tag: '原創', count: 149, index: 0 },
export interface TagObject {
  tag: string | null;
  count: number | null;
  index: number | null;
}

export const ZodTagObject = z.object({
  tag: z.string(),
  count: z.number(),
  index: z.number(),
});

interface TagFilter {
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

export const useTagFilter = create<TagFilter>()((set, get) => ({
  allFilter: [],
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
