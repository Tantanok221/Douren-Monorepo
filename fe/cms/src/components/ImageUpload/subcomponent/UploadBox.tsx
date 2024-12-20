import { useImageUploadContext } from "../context/useImageUploadContext.tsx";

interface props {
 title: string
}

export const UploadBox = ({title}: props) => {
  const {imageHook,uploadHook,multiple} = useImageUploadContext()
  const {onImageUpload,dragProps,isDragging} = imageHook
  const {  isPending,isSuccess } = uploadHook;
  const extendedClass = isDragging
    ? "border-highlightFormBorder"
    : "border-formBorder";
  if(isSuccess && !multiple) return null
  return (
    <button
      className={
        "w-full h-[150px] text-white  border-dashed border-formBorder border rounded " +
        extendedClass
      }
      onClick={onImageUpload}
      type={"button"}
      {...dragProps}
      disabled={isPending}
    >
      {isPending ? "上传中" : `拖拉照片或者點擊來放著${title}`}
    </button>
  );
}