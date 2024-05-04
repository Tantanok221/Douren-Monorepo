import { create } from "zustand";

interface Position {
  position: number;
  setPosition: (position: number) => void;
  initPosition: () => void;
}

export const usePosition = create<Position>()((set) => ({
  position: 0,
  setPosition: (position: number) => {
    set(() => ({ position }));
  },
  initPosition: () => set({ position: 0 }),
}));
