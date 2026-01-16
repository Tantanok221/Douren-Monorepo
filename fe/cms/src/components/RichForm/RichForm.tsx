import { FormImageUploadRef, Forms } from "../Forms";
import { SelectComponent } from "@lib/ui";
import { forwardRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { trpc } from "@/lib/trpc";

interface Props {
  label: React.ReactNode;
  formField: string;
}

interface ImageFieldProps {
  multiple?: boolean;
  label: React.ReactNode;
  formField: string;
  title: string;
}

interface EventFieldProps {
  label: string;
  formField: string;
}

export const InputTextField = ({ label, formField }: Props) => {
  return (
    <Forms.Field name={formField}>
      <Forms.HorizontalLayout>
        <Forms.Label>{label}</Forms.Label>
        <Forms.Message />
      </Forms.HorizontalLayout>
      <Forms.Control />
    </Forms.Field>
  );
};

export const TagFilterField = ({ label, formField }: Props) => {
  return (
    <Forms.Field name={formField}>
      <Forms.HorizontalLayout>
        <Forms.Label>{label}</Forms.Label>
        <Forms.Message />
      </Forms.HorizontalLayout>
      <Forms.TagFilter />
    </Forms.Field>
  );
};

export const ImageField = forwardRef<FormImageUploadRef, ImageFieldProps>(
  ({ label, formField, title, multiple }: ImageFieldProps, ref) => {
    return (
      <Forms.Field name={formField}>
        <Forms.Label>{label}</Forms.Label>
        <Forms.ImageUpload title={title} multiple={multiple} ref={ref} />
      </Forms.Field>
    );
  },
);

export const EventField = ({ label, formField }: EventFieldProps) => {
  const { setValue, watch } = useFormContext();
  const { data } = trpc.eventArtist.getAllEvent.useQuery();
  const currentValue = watch(formField);

  // Auto-select first event when data loads and no value is set
  useEffect(() => {
    if (data && data.length > 0 && !currentValue) {
      setValue(formField, data[0].id);
    }
  }, [data, currentValue, setValue, formField]);

  const onEventFieldChange = (value: string) => {
    setValue(formField, Number(value));
  };

  return (
    <Forms.Field name={formField}>
      <Forms.HorizontalLayout>
        <Forms.Label>{label}</Forms.Label>
        <Forms.Message />
      </Forms.HorizontalLayout>
      <SelectComponent
        value={currentValue ? String(currentValue) : undefined}
        onValueChange={onEventFieldChange}
      >
        <SelectComponent.Group>
          <SelectComponent.Label text={label} />
          {data
            ? data.map((item) => {
                return (
                  <SelectComponent.Item
                    key={item.id + item.name + "event"}
                    text={item.name}
                    value={String(item.id)}
                  />
                );
              })
            : null}
        </SelectComponent.Group>
      </SelectComponent>
    </Forms.Field>
  );
};
