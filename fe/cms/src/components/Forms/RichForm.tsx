import { Forms } from "./Forms.tsx";

interface Props {
  label: React.ReactNode;
  formField: string;
}

export const InputTextField = ({ label, formField }: Props) => {
  return <Forms.Field name={formField}>
    <Forms.HorizontalLayout>
      <Forms.Label>
        {label}
      </Forms.Label>
      <Forms.Message />
    </Forms.HorizontalLayout>
    <Forms.Control />
  </Forms.Field>;
};

export const TagFilterField = ({ label, formField }: Props) => {
  return <Forms.Field name={formField}>
    <Forms.HorizontalLayout>
      <Forms.Label>
        {label}
      </Forms.Label>
      <Forms.Message />
    </Forms.HorizontalLayout>
    <Forms.TagFilter />
  </Forms.Field>;
};