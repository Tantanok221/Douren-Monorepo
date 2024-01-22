import { create } from "zustand";
import { produce } from "immer";

export const useCollection = create((set, get) => ({
  collection: [],
  addCollection: (data) => {
    set((state) =>
      produce(state, (draftState) => {
        draftState.collection.push(data);
      })
    );
  },
  removeCollection: (data) => {
    set((state) => ({
      collection: state.collection.filter((val) => val !== data),
    }));
  },
  initCollection: () => {
    set(() => {
      const item = localStorage.getItem("FF42-Collection");
      let object = JSON.parse(item);
      if (object) {
        return { collection: object };
      }
      return { collection: [] }
      
    });
  },
  updateLocalStorage: () => {
    localStorage.removeItem("FF42-Collection");
    localStorage.setItem("FF42-Collection", JSON.stringify(get().collection));
  },
  checkAvailable: (data) => {
    const collectionName = get().collection.flatMap((val) => val.author_name);
    const dataName = data.author_name;
    return collectionName.filter((val) => val === dataName).length != 0;
  },
}));
