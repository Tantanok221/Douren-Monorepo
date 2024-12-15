import { useFormContext } from "react-hook-form";
import { PureTagFilter, TagFilterContextProvider, useTagFilterContext } from "@lib/ui";
import { forwardRef, Ref, useEffect } from "react";
import * as Form from "@radix-ui/react-form";
import { useFetchTagData } from "@/hooks";
import { useFormFieldContext } from "../context/FormFieldContext.ts";


export const FormTagFilter = forwardRef((props: unknown, ref: Ref<HTMLDivElement>) => {
  const tag = useFetchTagData();
  if (!tag) return <></>;
  return (
    <TagFilterContextProvider allFilter={tag}>
      <FormTagFilterBase ref={ref} />
    </TagFilterContextProvider>
  );
});


export const FormTagFilterBase = forwardRef((props: unknown, ref: Ref<HTMLDivElement>) => {
  const { setValue } = useFormContext();
  const { name } = useFormFieldContext();
  const allFilter = useTagFilterContext((state) => state.allFilter);
  const tagFilter = useTagFilterContext((state) => state.tagFilter);
  useEffect(() => {
    setValue(name, tagFilter);
  }, [name, setValue, tagFilter]);
  return <Form.Control asChild>
    <PureTagFilter ref={ref} allTag={allFilter} selectedTag={tagFilter} />
  </Form.Control>;
});