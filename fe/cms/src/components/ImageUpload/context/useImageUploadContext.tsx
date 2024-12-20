import { useContext } from "react";
import { ImageUploadContext } from "./ImageUploadContext.tsx";

export const useImageUploadContext = () => {
  const data = useContext(ImageUploadContext);
  if(!data) throw new Error("useImageUploadContext need to be use in ImageUploadContextProvider")
  return data
}
