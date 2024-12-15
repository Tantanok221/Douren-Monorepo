import ImageUploading, { ImageListType } from "react-images-uploading";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useFormFieldContext } from "../context";
import { useUploadImage } from "../../../hooks/useUploadImage.ts";
import * as HoverCard from "@radix-ui/react-hover-card";
import { X } from "lucide-react";


interface Props {
  title: string;
}


export const FormImageUpload = ({ title }: Props) => {
  const [images, setImages] = useState<ImageListType>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const { setValue } = useFormContext();
  const { name } = useFormFieldContext();
  const { mutate: uploadImage, isPending, isSuccess, data } = useUploadImage();
  useEffect(() => {
    if (currentFile != null) {
      uploadImage(currentFile);
    }
    console.log(currentFile)
  }, [currentFile, uploadImage]);

  useEffect(() => {
    if(currentFile == null){
      setValue(name, "")
      return
    }
      setValue(name, data);
  }, [currentFile, data, setValue, name]);

  const useOnChange = (imageList: ImageListType, _: number[] | undefined) => {
    setImages(imageList);
    if (imageList[0]?.file) {
      console.log("Have Files");
      setCurrentFile(imageList[0].file);
      return;
    }
    setCurrentFile(null);
  };

  return (
    <ImageUploading
      value={images}
      onChange={useOnChange}
    >
      {({
          onImageUpload,
          onImageRemoveAll,
          isDragging,
          dragProps
        }) => {

        const extendedClass = isDragging ? "border-highlightFormBorder" : "border-formBorder";
        if (currentFile && isSuccess) return <HoverCard.Root>
          <HoverCard.Trigger >
            <img className={"w-full "} alt={"User Uploaded Image"} src={data} />
          </HoverCard.Trigger>
          <HoverCard.Portal>
            <HoverCard.Content avoidCollisions={false} hideWhenDetached={true} align={"end"} side={"top"}>
              <button type={"button"} className={"relative rounded-xl bg-[#FF4C4C] w-full"} onClick={onImageRemoveAll} >
                <X size={16} color={"#ffffff"} />
              </button>
            </HoverCard.Content>
          </HoverCard.Portal>
        </HoverCard.Root>;
        return (
          <button
            className={"w-full h-[150px] text-white  border-dashed border-formBorder border rounded " + extendedClass}
            onClick={onImageUpload}
            type={"button"}
            {...dragProps}
            disabled={isPending}
          >
            {isPending ? "上传中" : `拖拉照片或者點擊來放著${title}`}
          </button>
        );
      }}
    </ImageUploading>
  );

};
