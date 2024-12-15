import { Forms } from "../Forms";

interface Props {
  label: React.ReactNode;
  formField: string;
}

interface ImageFieldProps{
  label: React.ReactNode;
  formField: string;
  title: string;
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

export const ImageField = ({ label, formField,title }: ImageFieldProps) => {
  return <Forms.Field name={formField}>
    <Forms.Label>{label}</Forms.Label>
    <Forms.ImageUpload title={title}/>
  </Forms.Field>
}