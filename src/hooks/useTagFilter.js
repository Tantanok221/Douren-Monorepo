import { create } from "zustand";
import { supabase } from "../helper/supabase";
import { immer } from 'zustand/middleware/immer'
import { produce } from 'immer'

export const useTagFilter = create((set, get) => ({
  allFilter: [],
  tagFilter: [],
  checked: ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",],
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
    set(() => ({ tagFilter: [] }));
  },
  getTag: (tag) => {
    return get().allFilter.filter((val) => val.tag === tag);
  },
  setChecked: (index, val) => {
    set((state) => produce(state, draftState => {
      draftState.checked[index] = val;
    }));
  },
}));
