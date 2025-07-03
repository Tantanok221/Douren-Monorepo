import { MultiStepFormContext } from "./useMultiStepFormContext.ts";
import { useEffect, useState } from "react";
import { createStore, StateCreator } from "zustand";

interface props {
  children: React.ReactNode;
  submitStep: number;
  onSubmit: () => Promise<void>;
}

export interface MultiStepStore {
  step: number;
  goBackStep: () => void;
  bumpStep: () => void;
  submitStep: number | null;
  onSubmit: () => Promise<void>;
}

const initMultiStepFormFunction = (
  submitStep: number,
  onSubmit: () => Promise<void>,
) => {
  const multiStepFormFunction: StateCreator<MultiStepStore> = (set) => ({
    step: 1,
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
    onSubmit,
    submitStep,
  });
  return multiStepFormFunction;
};
export const MultiStepFormProvider = ({
  children,
  submitStep,
  onSubmit,
}: props) => {
  const [store] = useState(() =>
    createStore<MultiStepStore>(
      initMultiStepFormFunction(submitStep, onSubmit),
    ),
  );

  useEffect(() => {
    const unsubscribe = store.subscribe(async (state) => {
      if (state.step === state.submitStep) {
        console.log("submit state triggered at MultiStepFormProvider");
        await onSubmit();
      }
    });

    return unsubscribe;
  }, [store, onSubmit]);

  return (
    <MultiStepFormContext.Provider value={store}>
      {children}
    </MultiStepFormContext.Provider>
  );
};
