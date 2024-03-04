import { create } from "zustand";

export const useNextPageAvailable = create((set) => ({
  nextPageAvailable: true,
  setNextPageAvailable: (bool: boolean) => {
    set(() => ({nextPageAvailable: bool}))
  },
  initNextPageAvailable: () => set({nextPageAvailable: true}),
}))