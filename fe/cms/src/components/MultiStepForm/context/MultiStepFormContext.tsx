import { MultiStepFormContext } from "./useMultiStepFormContext.ts";
import { useState } from "react";
import { createStore } from "zustand";
import { ArtistFormSchema } from "../../../routes/form/artist.tsx";
import { eventArtistSchema } from "../../../routes/form/eventartist.tsx";

interface props {
  children: React.ReactNode;
}

export interface MultiStepStore {
  artistStep: ArtistFormSchema | null;
  eventArtistStep: eventArtistSchema | null;
  setArtistStep: (step: ArtistFormSchema) => void;
  setEventArtistStep: (step: eventArtistSchema) => void;
  triggerSubmit: () => void
}

export const MultiStepFormProvider = ({ children }: props) => {
  const [store] = useState(() =>
    createStore<MultiStepStore>((set,get) => ({
      artistStep: null,
      eventArtistStep: null,
      setArtistStep: (step) => set((state) => ({
        artistStep: step,
        eventArtistStep: state.eventArtistStep
      })),
      setEventArtistStep: step => set((state) => ({
        artistStep: state.artistStep,
        eventArtistStep: step,
      })),
      triggerSubmit: () => {
        const artistData = get().artistStep
        const eventArtistData = get().eventArtistStep
        console.log("artist data:", artistData)
        console.log("event artist data:", eventArtistData)
      }
    }))
  );

  return (
    <MultiStepFormContext.Provider value={store}>
      {children}
    </MultiStepFormContext.Provider>
  );
};
