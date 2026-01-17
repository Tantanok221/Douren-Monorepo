import { ImageUpload } from "../../ImageUpload";
import { uploadImage } from "@/hooks";
import { forwardRef, useImperativeHandle, useState } from "react";

interface Props {
  title: string;
  multiple?: boolean;
}

export type FormImageUploadRef = {
  uploadImage: () => Promise<string>;
};

export const FormImageUpload = forwardRef<FormImageUploadRef, Props>(
  ({ multiple, title }: Props, ref) => {
    const [image, setImage] = useState<File[]>([]);
    useImperativeHandle(ref, () => {
      return {
        uploadImage: async () => {
          const allLink: string[] = [];
          for (const img of image) {
            allLink.push(await uploadImage(img));
          }
          return allLink.join("\n");
        },
      };
    }, [image]);

    return (
      <ImageUpload setValue={setImage} multiple={multiple}>
        <ImageUpload.UploadBox title={title} />
        <ImageUpload.ResultBox />
      </ImageUpload>
    );
  },
);
