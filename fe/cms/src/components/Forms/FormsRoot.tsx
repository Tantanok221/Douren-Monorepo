import * as Form from "@radix-ui/react-form";
import { FormProps } from "@radix-ui/react-form";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { ReactNode } from "react";

interface FormComponentProps<T extends FieldValues> extends FormProps {
  children: ReactNode;
  formHook: UseFormReturn<T>;
  OnSubmit: SubmitHandler<T>;
}

export const FormsRoot = <T extends FieldValues>({
  children,
  formHook,
  OnSubmit,
  ...rest
}: FormComponentProps<T>) => {
  const { handleSubmit } = formHook;
  return (
    <FormProvider {...formHook}>
      <Form.Root
        onSubmit={handleSubmit(OnSubmit)}
        {...rest}
        className="gap-6 flex flex-col w-full"
      >
        {children}
      </Form.Root>
    </FormProvider>
  );
};