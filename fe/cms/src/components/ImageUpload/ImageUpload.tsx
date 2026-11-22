import ImageUploadingModule, { ImageListType } from "react-images-uploading";
import { ImageUploadContextProvider } from "./context/ImageUploadContext.tsx";
import { ReactNode, useState } from "react";
import { ResultBox } from "./subcomponent/ResultBox.tsx";
import { UploadBox } from "./subcomponent/UploadBox.tsx";

type ImageUploadingComponent = typeof ImageUploadingModule;

// react-images-uploading is CJS with `exports.default`; Vite 8 resolves the
// default import of such modules to `module.exports` in "type": "module" apps.
const ImageUploading: ImageUploadingComponent =
  (ImageUploadingModule as unknown as { default?: ImageUploadingComponent })
    .default ?? ImageUploadingModule;

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
