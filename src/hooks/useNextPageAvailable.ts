import { create } from "zustand";

interface NextPageAvailable {
  nextPageAvailable: boolean;
  setNextPageAvailable: (bool: boolean) => void;
  initNextPageAvailable: () => void;
}

export const useNextPageAvailable = create<NextPageAvailable>()((set) => ({
  nextPageAvailable: true,
  setNextPageAvailable: (bool: boolean) => {
    set(() => ({ nextPageAvailable: bool }));
  },
  initNextPageAvailable: () => set({ nextPageAvailable: true }),
}));
