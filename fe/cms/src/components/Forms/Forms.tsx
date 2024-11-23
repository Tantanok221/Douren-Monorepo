import * as Form from "@radix-ui/react-form";
import {  FormProps } from "@radix-ui/react-form";
import {
  FormButton,
  FormControl,
  FormField,
  HorizontalLayout,
  FormMessage,
  FormsLabel,
  FormSubmit,
  FormTagFilter
} from "./subcomponent";
import { FieldValues, FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";
import { ReactNode } from "react";

interface FormComponentProps<T extends FieldValues, > extends FormProps {
  children: ReactNode;
  formHook: UseFormReturn<T>;
  OnSubmit: SubmitHandler<T>;
}


interface CompoundForm {
  Root: typeof RootComponent,
  Label: typeof FormsLabel,
  Message: typeof FormMessage,
  Field: typeof FormField,
  Button: typeof FormButton,
  HorizontalLayout: typeof HorizontalLayout,
  Control: typeof FormControl,
  Submit: typeof FormSubmit,
  TagFilter: typeof FormTagFilter
};

const RootComponent = <T extends FieldValues>({ children, formHook,
                                                OnSubmit,
                                                ...rest }: FormComponentProps<T>) => {
  const { handleSubmit } = formHook;
  return (
    <FormProvider {...formHook}>
      <Form.Root
        onSubmit={handleSubmit(OnSubmit)}
        {...rest}
        className="gap-6 flex flex-col w-full">
        {children}
      </Form.Root>
    </FormProvider>
  );
};

export const Forms: CompoundForm = {
  Root: RootComponent,
  Label: FormsLabel,
  Message: FormMessage,
  Field: FormField,
  Button: FormButton,
  HorizontalLayout: HorizontalLayout,
  Control: FormControl,
  Submit: FormSubmit,
  TagFilter: FormTagFilter
};