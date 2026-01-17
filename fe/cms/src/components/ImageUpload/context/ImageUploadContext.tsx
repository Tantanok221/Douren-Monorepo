import { createContext, ReactNode } from "react";
import { ExportInterface } from "react-images-uploading/dist/typings";

export interface ImageUploadHook {
  imageHook: ExportInterface;
  multiple?: boolean;
}

export const ImageUploadContext = createContext<ImageUploadHook | null>(null);

interface props {
  hook: ImageUploadHook;
  children: ReactNode;
}

export const ImageUploadContextProvider = ({ children, hook }: props) => {
  return (
    <ImageUploadContext.Provider value={hook}>
      {children}
    </ImageUploadContext.Provider>
  );
};
