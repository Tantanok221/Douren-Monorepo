import { createContext, useState } from "react";
import { createStore, StateCreator, StoreApi } from "zustand";
import { ReactNode } from "react";

type FormDataType = Record<string, unknown>;

export type SubmissionStatus =
  | { stage: "idle" }
  | { stage: "uploading"; message: string }
  | { stage: "submitting"; message: string }
  | { stage: "complete"; message: string }
  | { stage: "error"; message: string };

export interface FormDataState {
  formData: FormDataType;
  setData: <T>(key: string, data: T) => void;
  getData: <T>(key: string) => T;
  submissionStatus: SubmissionStatus;
  setSubmissionStatus: (status: SubmissionStatus) => void;
}

const createFormDataStore: StateCreator<FormDataState> = (set, get) => ({
  formData: {},
  submissionStatus: { stage: "idle" },
  setData: <T,>(key: string, data: T) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [key]: data,
      },
    }));
  },
  getData: <T,>(key: string): T => {
    if (!get().formData[key]) {
      throw new Error(`Data with key ${key} not found`);
    }
    return get().formData[key] as T;
  },
  setSubmissionStatus: (status: SubmissionStatus) => {
    set({ submissionStatus: status });
  },
});

export const FormDataContext = createContext<StoreApi<FormDataState> | null>(
  null,
);

export const FormDataProvider = ({ children }: { children: ReactNode }) => {
  const [store] = useState(() =>
    createStore<FormDataState>(createFormDataStore),
  );

  return (
    <FormDataContext.Provider value={store}>
      {children}
    </FormDataContext.Provider>
  );
};
