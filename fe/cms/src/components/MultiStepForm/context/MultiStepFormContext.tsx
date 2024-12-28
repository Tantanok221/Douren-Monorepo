import { MultiStepFormContext } from "./useMultiStepFormContext.ts";
import { useState } from "react";
import { createStore } from "zustand";
import {
  ArtistFormSchema,
  EventArtistSchema,
} from "@/routes/form/-components/form/schema";

interface props {
  children: React.ReactNode;
}

export interface MultiStepStore {
  step: number;
  artistStep: ArtistFormSchema | null;
  eventArtistStep: EventArtistSchema | null;
  setArtistStep: (step: ArtistFormSchema) => void;
  setEventArtistStep: (step: EventArtistSchema) => void;
  bumpStep: () => void;
  triggerSubmit: () => void;
}

export const MultiStepFormProvider = ({ children }: props) => {
  const [store] = useState(() =>
    createStore<MultiStepStore>((set, get) => ({
      step: 1,
      artistStep: null,
      eventArtistStep: null,
      setArtistStep: (step) =>
        set((state) => ({
          artistStep: step,
          eventArtistStep: state.eventArtistStep,
        })),
      setEventArtistStep: (step) =>
        set((state) => ({
          artistStep: state.artistStep,
          eventArtistStep: step,
        })),
      bumpStep: () => {
        set((state) => ({
          step: state.step + 1,
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
