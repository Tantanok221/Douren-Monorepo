import { FormFieldContext } from "./FormFieldContext.ts";

interface Props {
  children: React.ReactNode;
  name: string;
}

export const FormFieldContextProvider = ({ children, name }: Props) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      {children}
    </FormFieldContext.Provider>
  );
};
