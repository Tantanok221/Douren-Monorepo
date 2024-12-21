import ImageUploading, { ImageListType } from "react-images-uploading";
import { ImageUploadContextProvider } from "./context/ImageUploadContext.tsx";
import { ReactNode, useState } from "react";
import { ResultBox } from "./subcomponent/ResultBox.tsx";
import { UploadBox } from "./subcomponent/UploadBox.tsx";

interface props {
  children: ReactNode;
  setValue: (val: File[]) => void;
  multiple?: boolean;
}

export const ImageUpload: React.FC<props> & {
  ResultBox: typeof ResultBox;
  UploadBox: typeof UploadBox;
} = ({ setValue, multiple, children }) => {
  const [images, setImages] = useState<ImageListType>([]);
  const useOnChange = (imageList: ImageListType) => {
    setImages(imageList);
    const allFile: File[] = [];
    imageList.forEach((i) => {
      if (i.file) allFile.push(i.file);
    });
    setValue(allFile);
  };
  return (
    <ImageUploading multiple value={images} onChange={useOnChange}>
      {(imageHook) => (
        <ImageUploadContextProvider hook={{ imageHook, multiple }}>
          {children}
        </ImageUploadContextProvider>
      )}
    </ImageUploading>
  );
};
ImageUpload.ResultBox = ResultBox;
ImageUpload.UploadBox = UploadBox;
