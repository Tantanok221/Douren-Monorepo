import { MultiStepFormContext } from "./useMultiStepFormContext.ts";
import { useState } from "react";
import { createStore, StateCreator } from "zustand";
import {
  ArtistFormSchema,
  EventArtistSchema,
} from "@/routes/form/-components/form/schema";
import { ProductFormSchema } from "../../../routes/form/-components/form/schema";

interface props {
  children: React.ReactNode;
}

type submitStepState = "" | "submitting" | "complete" | "fail";

export interface MultiStepStore {
  step: number;
  artistStep: ArtistFormSchema | null;
  eventArtistStep: EventArtistSchema | null;
  productStep: ProductFormSchema[] | null;
  submitState: submitStepState;
  setSubmitState: (step: submitStepState) => void;
  setArtistStep: (step: ArtistFormSchema) => void;
  setEventArtistStep: (step: EventArtistSchema) => void;
  setProductStep: (step: ProductFormSchema[]) => void;
  goBackStep: () => void;
  bumpStep: () => void;
  triggerSubmit: () => void;
}

const multiStepFormFunction: StateCreator<MultiStepStore> = (set, get) => ({
  step: 1,
  submitState: "",
  artistStep: null,
  eventArtistStep: null,
  productStep: null,
  setArtistStep: (step) =>
    set(() => ({
      artistStep: step,
    })),
  setEventArtistStep: (step) =>
    set(() => ({
      eventArtistStep: step,
    })),
  setProductStep: (step) =>
    set(() => ({
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
  setSubmitState: (state: submitStepState) => {
    set(() => ({
      submitState: state,
    }));
  },
  triggerSubmit: () => {
    const artistData = get().artistStep;
    const eventArtistData = get().eventArtistStep;
    console.log("artist data:", artistData);
    console.log("event artist data:", eventArtistData);
  },
});

export const MultiStepFormProvider = ({ children }: props) => {
  const [store] = useState(() =>
    createStore<MultiStepStore>(multiStepFormFunction),
  );

  return (
    <MultiStepFormContext.Provider value={store}>
      {children}
    </MultiStepFormContext.Provider>
  );
};
