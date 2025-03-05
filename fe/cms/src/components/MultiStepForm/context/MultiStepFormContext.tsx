import { MultiStepFormContext } from "./useMultiStepFormContext.ts";
import { useEffect, useState } from "react";
import { createStore, StateCreator } from "zustand";
import {
  ArtistFormSchema,
  EventArtistSchema,
} from "@/routes/form/-components/form/schema";
import { ProductFormSchema } from "../../../routes/form/-components/form/schema";
import { trpc } from "../../../helper";
import { ArrayTagHelper } from "@lib/ui/src/helper/tag.ts";

interface props {
  children: React.ReactNode;
  triggerStep: number;
}

type submitStepState = "" | "complete";

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
}

const multiStepFormFunction: StateCreator<MultiStepStore> = (set) => ({
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
  setSubmitState: (state: submitStepState) => {
    set(() => ({
      submitState: state,
    }));
  },
  goBackStep: () => {
    set((state) => ({
      step: state.step - 1,
    }));
  },
});

export const MultiStepFormProvider = ({ children, triggerStep }: props) => {
  const [store] = useState(() =>
    createStore<MultiStepStore>(multiStepFormFunction),
  );
  const createArtist = trpc.artist.createArtist.useMutation();
  const createEventArtist = trpc.eventArtist.createEventArtist.useMutation();
  useEffect(() => {
    store.subscribe(async (state) => {
      if (state.step === triggerStep) {
        state.bumpStep();
        console.log("trigger submit");
        console.log(state.submitState);
        const { artistStep, eventArtistStep } = state;
        if (!artistStep || !eventArtistStep) return;
        const TagHelper = new ArrayTagHelper(artistStep.tags);
        const artistDataWithTags = {
          ...artistStep,
          tags: TagHelper.toString(),
        };
        const [artistData] = await createArtist.mutateAsync(artistDataWithTags);
        eventArtistStep.artistId = artistData.uuid;
        createEventArtist.mutate(eventArtistStep);
      }
    });
  }, [triggerStep, store, createArtist, createEventArtist]);

  return (
    <MultiStepFormContext.Provider value={store}>
      {children}
    </MultiStepFormContext.Provider>
  );
};
