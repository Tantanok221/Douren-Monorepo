import { createContext, useContext } from "react";


interface FormContextType {
  name: string
}

export const FormFieldContext = createContext<FormContextType | null>(null);

export const useFormFieldContext = () => {
  const name = useContext(FormFieldContext);
  if(!name) throw new Error("useFormContext must be used within FormContextProvider");
  return name
};
