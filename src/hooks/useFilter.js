import { create } from "zustand";

export const useFilter = create((set) => ({
  table: "author_name",
  name: "攤位名字",
  setTable: (table) =>
    set(() => {
      table;
    }),
  ascending: true,
  setAscending: (ascending) =>
    set(() => {
      ascending;
    }),
  setFilter: (filter) =>
    set(() => ({ table: filter[0], ascending: filter[1], name: filter[2] })),
}));
