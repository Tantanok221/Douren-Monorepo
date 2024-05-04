import { create } from "zustand";

interface Sort {
  table: string;
  name: string;
  setTable: (table: string) => void;
  ascending: boolean;
  setAscending: (ascending: boolean) => void;
  setFilter: (filter: [string, boolean, string]) => void;
}

export const useSort = create<Sort>()((set) => ({
  table: "Booth_name",
  name: "攤位名字",
  setTable: (table) => {
    set(() => {
      return { table };
    });
  },
  ascending: true,
  setAscending: (ascending) => {
    set(() => {
      return { ascending };
    });
  },
  setFilter: (filter) =>
    set(() => ({ table: filter[0], ascending: filter[1], name: filter[2] })),
}));
