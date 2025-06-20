import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { Forms, FormButton } from "@/components";
import { useFormStep } from "./FormStep";

export const FormStepNavigation = () => {
  const { onNext, onPrevious, isProcessing } = useFormStep();
  
  return (
    <div className="w-full">
      <Forms.HorizontalLayout>
        <Forms.Button
          onClick={onPrevious}
          extendClass="bg-white"
          type="button"
          disabled={isProcessing}
        >
          <ArrowLeft /> 上一步
        </Forms.Button>
        <FormButton 
          extendClass="bg-white" 
          onClick={onNext}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : '下一步'} <ArrowRight />
        </FormButton>
      </Forms.HorizontalLayout>
    </div>
  );
};