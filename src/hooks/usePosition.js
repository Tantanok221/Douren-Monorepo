import { create } from "zustand";

export const usePosition = create((set) => ({
  position: 0,
  setPosition: (position) => {
    set(() => ({position}))
  }
}))