import * as Form from "@radix-ui/react-form";
import { forwardRef, ReactNode, useEffect } from "react";
import { FormControlProps } from "@radix-ui/react-form";
import { PureTagFilter, TagFilterContextProvider, useTagFilterContext } from "@lib/ui";
import { useFetchTagData } from "../../../hooks";
import {  FieldValues, SetFieldValue } from "react-hook-form";

interface childrenProps {
  children: ReactNode;
}

interface messageProps {
  condition: boolean;
}

interface nameProps {
  name: string;
}

interface setValueProps<T extends FieldValues> {
  control: SetFieldValue<T>
}

export const FormsLabel = ({ children }: childrenProps) => {
  return (<Form.Label className={"text-white font-sans"}>
    {children}
  </Form.Label>);
};

export const FormMessage = ({ children, condition }: messageProps & childrenProps) => {
  return condition ?
    <Form.Message className={"text-tagText font-sans "}> {children} </Form.Message> : null;
};

export const FormField = ({ children, name }: childrenProps & nameProps) => {
  return <Form.Field className={"flex flex-col gap-1 w-full"} name={name}>{children}</Form.Field>;
};

// Form Label and Message gap
export const FormLabelMessageStyle = ({ children }: childrenProps) => {
  return <div className={"flex flex-row justify-between gap-6 text-tagText font-sans"}>
    {children}</div>;
};

export const FormControl = forwardRef<HTMLInputElement,FormControlProps>((props,ref) => {
  return <Form.Control
    className={"border text-tagText px-2 border-formBorder bg-transparent rounded"}
    {...props}
    ref={ref}
  />;
});

export const FormTagFilter = <T extends FieldValues>({control}: setValueProps<T>) => {
  const tag = useFetchTagData();
  if(!tag) return <></>
  return <TagFilterContextProvider allFilter={tag}>
    <FormTagFilterBase control={control} />
  </TagFilterContextProvider>;
};

const FormTagFilterBase = <T extends FieldValues>({control}: setValueProps<T>) => {
  const allFilter = useTagFilterContext((state) => state.allFilter);
  const tagFilter = useTagFilterContext((state) => state.tagFilter);
  useEffect(() => {
    control("tag",tagFilter)
  },[control, tagFilter]);
  return <Form.Control asChild>
    <PureTagFilter allTag={allFilter} selectedTag={tagFilter} />
  </Form.Control>;

};


export const FormSubmit = ({ children }: childrenProps) => {
  return <Form.Submit asChild>
    <button
      className={"w-full bg-white rounded-lg items-center justify-center py-1 flex gap-[3px] "}>
      {children}
    </button>
  </Form.Submit>;
};
