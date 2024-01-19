import { create } from "zustand";
import {supabase} from "../helper/supabase"
export const useTagFilter = create((set) => ({
  allFilter: [],
  tagFilter: [],
  setAllFilter: async () => {
    const _data = await supabase.from("FF42-Tag").select("*")
    set(() => ({allFilter: _data.data}))
  }
}));
