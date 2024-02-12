import { create } from "zustand";

export const useNextPageAvailable = create((set) => ({
  nextPageAvailable: true,
  setNextPageAvailable: (bool) => {
    set(() => ({nextPageAvailable: bool}))
  },
  initNextPageAvailable: () => set({nextPageAvailable: true}),
}))