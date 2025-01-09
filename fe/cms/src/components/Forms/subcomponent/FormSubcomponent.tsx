import * as Form from "@radix-ui/react-form";
import { FormControlProps } from "@radix-ui/react-form";
import { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { useFormFieldContext } from "../context";
import { FormFieldContextProvider } from "../context";

interface childrenProps {
  children: ReactNode;
}

interface formSubmitProps {
  children: ReactNode;
  disabled?: boolean;
}

interface nameProps {
  name: string;
}

interface extendClassProps {
  extendClass?: string;
}

export const FormsLabel = ({ children }: childrenProps) => {
  return (
    <Form.Label className={"text-white font-sans w-full"}>
      {children}
    </Form.Label>
  );
};

export const FormMessage = () => {
  const {
    formState: { errors },
  } = useFormContext();
  const { name } = useFormFieldContext();
  return errors[name] ? (
    <Form.Message className={"text-tagText font-sans w-full text-right"}>
      {" "}
      {String(errors[name]?.message)}{" "}
    </Form.Message>
  ) : null;
};

export const FormField = ({ children, name }: childrenProps & nameProps) => {
  return (
    <FormFieldContextProvider name={name}>
      <Form.Field className={"flex flex-col gap-1 w-full"} name={name}>
        {children}
      </Form.Field>
    </FormFieldContextProvider>
  );
};

// Form Label and Message gap
export const HorizontalLayout = ({ children }: childrenProps) => {
  return (
    <div
      className={"flex flex-row justify-between gap-6 font-sans"}
    >
      {children}
    </div>
  );
};

export const FormControl = ({ ...props }: FormControlProps) => {
  const { name } = useFormFieldContext();
  const { control } = useFormContext();
  return (
    <input
      className={
        "border text-tagText px-2 border-formBorder bg-transparent rounded"
      }
      {...props}
      {...control.register(name)}
    />
  );
};

type FormButtonProps = extendClassProps & React.ComponentPropsWithRef<"button">;
export const FormButton = ({
  extendClass,
  children,
  ...rest
}: FormButtonProps) => {
  return (
    <button
      className={
        "w-full rounded-lg items-center justify-center py-1 flex gap-[3px] " +
        extendClass
      }
      {...rest}
    >
      {children}
    </button>
  );
};

export const FormSubmit = ({ children, disabled }: formSubmitProps) => {
  return (
    <Form.Submit asChild>
      <FormButton disabled={disabled} extendClass={"bg-white"} type={"submit"}>
        {children}
      </FormButton>
    </Form.Submit>
  );
};
