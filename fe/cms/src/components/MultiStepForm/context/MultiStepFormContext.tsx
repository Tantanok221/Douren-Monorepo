import { MultiStepFormContext } from "./useMultiStepFormContext";

interface props {
  children: React.ReactNode;
}

export const MultiStepFormProvider = ({ children }: props) => {
  return (
    <MultiStepFormContext.Provider value={null}>
      {children}
    </MultiStepFormContext.Provider>
  );
};
