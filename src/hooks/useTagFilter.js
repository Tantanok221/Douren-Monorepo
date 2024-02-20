import { create } from "zustand";
import { supabase } from "../helper/supabase";
import { produce } from "immer";

export const useTagFilter = create((set, get) => ({
  allFilter: [],
  tagFilter: [],
  checked: Array(30).fill(""),
  setAllFilter: async () => {
    const _data = await supabase.from("FF42-Tag").select("*").order("index", { ascending: true });
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
    set(() => ({ tagFilter: [], checked: Array(30).fill("") }));
  },
  getTag: (tag) => {
    return get().allFilter.filter((val) => val.tag === tag);
  },
  setChecked: (index, val) => {
    set((state) =>
      produce(state, (draftState) => {
        draftState.checked[index] = val;
      })
    );
  },
}));
