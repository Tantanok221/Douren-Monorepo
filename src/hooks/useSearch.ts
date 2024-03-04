import { create } from "zustand";

interface Search{
  search: string

}

export const useSearch = create<Search>()((set) => ({
  search: "",
  setSearch: (search: string) => {
    set(() => ({search}))
  }
}))