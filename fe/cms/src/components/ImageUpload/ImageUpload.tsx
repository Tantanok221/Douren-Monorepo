import ImageUploading, {
  ImageListType,
} from "react-images-uploading";
import { ImageUploadContextProvider } from "./context/ImageUploadContext.tsx";
import { ReactNode, useEffect, useState } from "react";
import { useUploadImage } from "../../hooks";
import { ResultBox } from "./subcomponent/ResultBox.tsx";
import { UploadBox } from "./subcomponent/UploadBox.tsx";
import { UseFormSetValue } from "react-hook-form/dist/types/form";
import { FieldValues } from "react-hook-form";

interface props<T extends FieldValues> {
  children: ReactNode;
  setValue: UseFormSetValue<T>;
  multiple?: boolean;
  formField: string;
}

export const ImageUpload: React.FC<props<FieldValues>> & {
  ResultBox: typeof ResultBox;
  UploadBox: typeof UploadBox;
} = ({ formField: name, setValue, multiple, children }) => {
  const [images, setImages] = useState<ImageListType>([]);
  const uploadHook = useUploadImage();
  const { mutate, data } = uploadHook;
  useEffect(() => {
    setValue(name, data);
  }, [setValue, data, name]);
  const useOnChange = (imageList: ImageListType) => {
    if (!multiple) {
      if (imageList[0].file) {
        mutate(imageList[0].file);
        setImages(imageList);
        console.log(data);
      }
      return;
    }
  };
  return (
    <ImageUploading multiple value={images} onChange={useOnChange}>
      {(imageHook) => (
        <ImageUploadContextProvider hook={{ imageHook, uploadHook, multiple }}>
          {children}
        </ImageUploadContextProvider>
      )}
    </ImageUploading>
  );
};
ImageUpload.ResultBox = ResultBox;
ImageUpload.UploadBox = UploadBox;
