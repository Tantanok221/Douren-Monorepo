import React from "react";

interface FormStepContextValue {
  stepId: string;
  onNext: () => Promise<void>;
  onPrevious: () => void;
  isProcessing: boolean;
}

export const FormStepContext = React.createContext<FormStepContextValue | null>(
  null,
);

export const useFormStep = () => {
  const context = React.useContext(FormStepContext);
  if (!context) {
    throw new Error("useFormStep must be used within FormStepProvider");
  }
  return context;
};
