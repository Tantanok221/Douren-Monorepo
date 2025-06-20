import React, { useState } from "react";
import { useMultiStepFormContext } from "../MultiStepForm/context";
import { useFormDataContext } from "../FormDataContext";

interface FormStepProps<TData = any> {
  stepId: string;
  children: React.ReactNode;
  
  // Validation - runs before submission
  onValidate?: () => boolean | Promise<boolean>;
  
  // Data processing/submission logic
  onSubmit?: (data: TData) => Promise<void>;
  
  // Custom next step logic (optional)
  onNext?: () => void;
  
  // Skip this step based on conditions
  skipIf?: () => boolean;
  
  // Loading states
  isLoading?: boolean;
}

export function FormStep<TData>({ 
  stepId, 
  children, 
  onValidate, 
  onSubmit,
  onNext,
  skipIf,
  isLoading = false
}: FormStepProps<TData>) {
  const { bumpStep, goBackStep } = useMultiStepFormContext((state) => state);
  const { getData, setData } = useFormDataContext((state) => state);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNext = async () => {
    if (skipIf?.()) {
      bumpStep();
      return;
    }

    setIsProcessing(true);
    
    try {
      // Run validation first
      if (onValidate && !(await onValidate())) {
        setIsProcessing(false);
        return;
      }
      
      // Get current data and run submission logic
      const currentData = getData<TData>(stepId);
      if (onSubmit) {
        await onSubmit(currentData);
      }
      
      // Custom next logic or default bump
      if (onNext) {
        onNext();
      } else {
        bumpStep();
      }
      
    } catch (error) {
      console.error(`Step ${stepId} failed:`, error);
      // Handle error (maybe show toast)
    } finally {
      setIsProcessing(false);
    }
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

interface FormStepContextValue {
  stepId: string;
  onNext: () => Promise<void>;
  onPrevious: () => void;
  isProcessing: boolean;
}

const FormStepContext = React.createContext<FormStepContextValue | null>(null);

export const FormStepProvider: React.FC<{
  stepId: string;
  onNext: () => Promise<void>;
  onPrevious: () => void;
  isProcessing: boolean;
  children: React.ReactNode;
}> = ({ stepId, onNext, onPrevious, isProcessing, children }) => {
  return (
    <FormStepContext.Provider value={{ stepId, onNext, onPrevious, isProcessing }}>
      {children}
    </FormStepContext.Provider>
  );
};

export const useFormStep = () => {
  const context = React.useContext(FormStepContext);
  if (!context) {
    throw new Error('useFormStep must be used within FormStepProvider');
  }
  return context;
};