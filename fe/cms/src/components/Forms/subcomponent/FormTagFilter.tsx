import { FieldValues, SetFieldValue } from "react-hook-form";
import { PureTagFilter, TagFilterContextProvider, useTagFilterContext } from "@lib/ui";
import { forwardRef, useEffect } from "react";
import * as Form from "@radix-ui/react-form";
import { useFetchTagData } from "../../../hooks";

interface setValueProps<T extends FieldValues> {
  control: SetFieldValue<T>;
}

function FormTagFilterComponent<T extends FieldValues>({ control }: setValueProps<T>, ref: React.Ref<HTMLDivElement>) {
  const tag = useFetchTagData();
  if (!tag) return <></>;
  return (
    <TagFilterContextProvider allFilter={tag}>
      <FormTagFilterBase control={control} ref={ref} />
    </TagFilterContextProvider>
  );
}

export const FormTagFilter = forwardRef(FormTagFilterComponent) as <T extends FieldValues>(
  props: setValueProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => ReturnType<typeof FormTagFilterComponent>;

const FormTagFilterBaseComponent = <T extends FieldValues>({ control }: setValueProps<T>, ref: React.Ref<HTMLDivElement>) => {
  const allFilter = useTagFilterContext((state) => state.allFilter);
  const tagFilter = useTagFilterContext((state) => state.tagFilter);
  useEffect(() => {
    control("tag", tagFilter);
  }, [control, tagFilter]);
  return <Form.Control asChild>
    <PureTagFilter ref={ref} allTag={allFilter} selectedTag={tagFilter} />
  </Form.Control>;
};

const FormTagFilterBase = forwardRef(FormTagFilterBaseComponent) as <T extends FieldValues>(props: setValueProps<T> & {
  ref?: React.Ref<HTMLDivElement>
}) => ReturnType<typeof FormTagFilterBaseComponent>;