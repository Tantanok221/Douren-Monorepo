import { create } from "zustand";

interface Search{
  search: string
  setSearch: (search:string) => void
}

export const useSearch = create<Search>()((set) => ({
  search: "",
  setSearch: (search: string) => {
    set(() => ({search}))
  }
}))