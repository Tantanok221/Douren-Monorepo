import * as HoverCard from "@radix-ui/react-hover-card";
import { X } from "lucide-react";
import { useImageUploadContext } from "../context/useImageUploadContext.tsx";

export const ResultBox = () => {
  const { uploadHook, imageHook } = useImageUploadContext();
  const { data, isSuccess } = uploadHook;
  const { onImageRemoveAll } = imageHook;
  console.log(data, isSuccess);
  if (isSuccess)
    return (
      <HoverCard.Root>
        <HoverCard.Trigger>
          <img className={"w-full "} alt={"User Uploaded Image"} src={data} />
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content
            avoidCollisions={false}
            hideWhenDetached={true}
            align={"end"}
            side={"top"}
          >
            <button
              type={"button"}
              className={"relative rounded-xl bg-[#FF4C4C] w-full"}
              onClick={onImageRemoveAll}
            >
              <X size={16} color={"#ffffff"} />
            </button>
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    );
};
