import { MultiStepFormContext } from "./useMultiStepFormContext.ts";
import { useState } from "react";
import { createStore } from "zustand";
import {
  ArtistFormSchema,
  EventArtistSchema,
} from "@/routes/form/-components/form/schema";
import { ProductFormSchema } from "../../../routes/form/-components/form/schema";
interface props {
  children: React.ReactNode;
}

export interface MultiStepStore {
  step: number;
  artistStep: ArtistFormSchema | null;
  eventArtistStep: EventArtistSchema | null;
  productStep: ProductFormSchema[] | null;
  setArtistStep: (step: ArtistFormSchema) => void;
  setEventArtistStep: (step: EventArtistSchema) => void;
  setProductStep: (step: ProductFormSchema[]) => void;
  goBackStep: () => void;
  bumpStep: () => void;
  triggerSubmit: () => void;
}

export const MultiStepFormProvider = ({ children }: props) => {
  const [store] = useState(() =>
    createStore<MultiStepStore>((set, get) => ({
      step: 1,
      artistStep: null,
      eventArtistStep: null,
      productStep: null,
      setArtistStep: (step) =>
        set((state) => ({
          artistStep: step,
        })),
      setEventArtistStep: (step) =>
        set((state) => ({
          eventArtistStep: step,
        })),
      setProductStep: (step) =>
        set((state) => ({
          productStep: step,
        })),
      bumpStep: () => {
        set((state) => ({
          step: state.step + 1,
        }));
      },
      goBackStep: () => {
        set((state) => ({
          step: state.step - 1,
        }));
      },
      triggerSubmit: () => {
        const artistData = get().artistStep;
        const eventArtistData = get().eventArtistStep;
        console.log("artist data:", artistData);
        console.log("event artist data:", eventArtistData);
      },
    })),
  );

  return (
    <MultiStepFormContext.Provider value={store}>
      {children}
    </MultiStepFormContext.Provider>
  );
};
