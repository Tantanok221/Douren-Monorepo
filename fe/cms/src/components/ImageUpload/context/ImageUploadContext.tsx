import { createContext, ReactNode } from "react";
import { ExportInterface } from "react-images-uploading/dist/typings";
import { UseMutationResult } from "@tanstack/react-query";

export interface ImageUploadHook {
  imageHook: ExportInterface;
  uploadHook: UseMutationResult<string, Error, File | null, unknown>;
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
