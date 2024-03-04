import { create } from "zustand";

interface Sort {
  table: string;
  name: string;
  setTable: (table: string) => void;
  ascending: boolean
  setAscending: (ascending: boolean) => void;
}

export const useSort = create<Sort>()((set) => ({
  table: "author_name",
  name: "攤位名字",
  setTable: (table) => {
    set(() => {
      return { table };
    });
  },
  ascending: true,
  setAscending: (ascending) =>
  {
    set(() => {
      return { ascending };
    });
  },
  setFilter: (filter: [string,boolean,string]) =>
    set(() => ({ table: filter[0], ascending: filter[1], name: filter[2] })),
}));
