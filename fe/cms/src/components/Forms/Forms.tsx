import * as Form from "@radix-ui/react-form";
import { forwardRef, ReactNode } from "react";
import { FormProps } from "@radix-ui/react-form";
import {
  FormControl,
  FormField,
  FormLabelMessageStyle,
  FormMessage,
  FormsLabel,
  FormSubmit,
  FormTagFilter
} from "./subcomponent";

interface props extends FormProps {
  children: ReactNode
}


interface CompoundForm extends React.FC<props> {
  Label: typeof FormsLabel;
  Message: typeof FormMessage;
  Field: typeof FormField;
  FormLabelMessageStyle: typeof FormLabelMessageStyle;
  Control: typeof FormControl;
  Submit: typeof FormSubmit;
  TagFilter : typeof FormTagFilter
}


const FormsComponent = forwardRef<HTMLFormElement,props>(({children,...rest},ref) => {
  return (<Form.Root ref={ref} {...rest} className={"gap-6 flex flex-col w-full"}>
    {children}
  </Form.Root>);
});


export const Forms = Object.assign(FormsComponent, {
  Label: FormsLabel,
  Message: FormMessage,
  Field: FormField,
  FormLabelMessageStyle: FormLabelMessageStyle,
  Control: FormControl,
  Submit: FormSubmit,
  TagFilter: FormTagFilter,
}) as CompoundForm;