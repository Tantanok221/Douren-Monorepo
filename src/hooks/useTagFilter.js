import { create } from "zustand";
import { supabase } from "../helper/supabase";
export const useTagFilter = create((set, get) => ({
  allFilter: [],
  tagFilter: [],
  setAllFilter: async () => {
    const _data = await supabase.from("FF42-Tag").select("*");
    set(() => ({ allFilter: _data.data }));
  },
  addTagFilter: (data) => {
    set((state) => ({ tagFilter: [...state.tagFilter, data] }));
  },
  removeTagFilter: (data) => {
    set((state) => ({
      tagFilter: state.tagFilter.filter((val) => val !== data),
    }));
  },
  removeAllTagFilter: () => {
    set(() => ({tagFilter: []}))
  },
  getTag: (tag) => {
    return get().allFilter.filter((val) => val.tag === tag);
  },
}));
