import React, { useState } from "react";
import { useMultiStepFormContext } from "../MultiStepForm";
import { FormStepContext } from "./useFormStep";

interface FormStepProps {
  stepId: string;
  children: React.ReactNode;

  // Custom next step logic (optional)
  onNext?: () => void;

  // Skip this step based on conditions
  skipIf?: () => boolean;

  // Only render on specific step
  activeStep?: number;

  // Loading states
  isLoading?: boolean;
}

export function FormStep({
  stepId,
  children,
  onNext,
  skipIf,
  activeStep,
  isLoading = false,
}: FormStepProps) {
  const {
    bumpStep,
    goBackStep,
    step: currentStep,
  } = useMultiStepFormContext((state) => state);
  const [isProcessing, setIsProcessing] = useState(false);

  // Don't render if activeStep is specified and doesn't match current step
  if (activeStep !== undefined && currentStep !== activeStep) {
    return null;
  }

  const handleNext = async () => {
    if (skipIf?.()) {
      bumpStep();
      return;
    }

    setIsProcessing(true);

    // Custom next logic or default bump
    if (onNext) {
      onNext();
    } else {
      bumpStep();
    }

    setIsProcessing(false);
  };

  const handlePrevious = () => {
    goBackStep();
  };

  return (
    <FormStepProvider
      stepId={stepId}
      onNext={handleNext}
      onPrevious={handlePrevious}
      isProcessing={isProcessing || isLoading}
    >
      {children}
    </FormStepProvider>
  );
}

export const FormStepProvider: React.FC<{
  stepId: string;
  onNext: () => Promise<void>;
  onPrevious: () => void;
  isProcessing: boolean;
  children: React.ReactNode;
}> = ({ stepId, onNext, onPrevious, isProcessing, children }) => {
  return (
    <FormStepContext.Provider
      value={{ stepId, onNext, onPrevious, isProcessing }}
    >
      {children}
    </FormStepContext.Provider>
  );
};
