import * as HoverCard from "@radix-ui/react-hover-card";
import { X } from "lucide-react";
import { useImageUploadContext } from "../context/useImageUploadContext.tsx";

export const ResultBox = () => {
  const {  imageHook } = useImageUploadContext();
  const {  onImageRemove ,imageList} = imageHook;
    return (
      imageList.map((item, index) => {
        return (
          <HoverCard.Root key={"user upload image"+index}>
            <HoverCard.Trigger>
              <img className={"w-full "} alt={"User Uploaded Image"} src={item.dataURL} />
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
                  onClick={() => {
                    onImageRemove(index)
                  }
                }
                >
                  <X size={16} color={"#ffffff"} />
                </button>
              </HoverCard.Content>
            </HoverCard.Portal>
          </HoverCard.Root>
        );
      })

    );
};
