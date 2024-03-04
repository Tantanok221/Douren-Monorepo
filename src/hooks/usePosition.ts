import { create } from "zustand";

export const usePosition = create((set) => ({
  position: 0,
  setPosition: (position: number) => {
    set(() => ({position}))
  },
  initPosition: () => set({position: 0}),
}))