import { FormImageUploadRef, Forms } from "../Forms";
import { SelectComponent } from "@lib/ui";
import { forwardRef } from "react";
import { trpc } from "../../helper";
import { useFormContext } from "react-hook-form";

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
  const { setValue } = useFormContext();
  const { data } = trpc.eventArtist.getAllEvent.useQuery();
  const onEventFieldChange = (value: string) => {
    setValue(formField, Number(value));
  };

  return (
    <Forms.Field name={formField}>
      <Forms.HorizontalLayout>
        <Forms.Label>{label}</Forms.Label>
        <Forms.Message />
      </Forms.HorizontalLayout>
      <SelectComponent defaultValue={"3"} onValueChange={onEventFieldChange}>
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
