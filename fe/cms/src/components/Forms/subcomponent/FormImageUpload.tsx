import { useFormContext } from "react-hook-form";
import { useFormFieldContext } from "../context";
import { ImageUpload } from "../../ImageUpload/ImageUpload.tsx";

interface Props {
  title: string;
}

export const FormImageUpload = ({ title }: Props) => {
  const { setValue } = useFormContext();
  const { name } = useFormFieldContext();

  return (
  <ImageUpload setValue={setValue} formField={name}>
    <ImageUpload.ResultBox/>
    <ImageUpload.UploadBox title={title}/>
  </ImageUpload>
  );
};
