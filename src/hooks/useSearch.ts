import { create } from "zustand";


export const useSearch = create((set) => ({
  search: "",
  setSearch: (search:string) => {
    set(() => ({search}))
  }
}))