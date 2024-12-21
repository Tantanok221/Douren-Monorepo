import { useImageUploadContext } from "../context/useImageUploadContext.tsx";

interface props {
  title: string;
}

export const UploadBox = ({ title }: props) => {
  const { imageHook,  multiple } = useImageUploadContext();
  const { imageList, onImageUpload, dragProps, isDragging } = imageHook;
  const extendedClass = isDragging
    ? "border-highlightFormBorder"
    : "border-formBorder";
  if (imageList.length>0 && !multiple) return null;
  return (
    <button
      className={
        "w-full h-[150px] text-white  border-dashed border-formBorder border rounded " +
        extendedClass
      }
      onClick={onImageUpload}
      type={"button"}
      {...dragProps}
    >
      {`拖拉照片或者點擊來放著${title}`}
    </button>
  );
};
