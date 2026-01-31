import { ImageUpload } from "../../ImageUpload";
import { uploadImage } from "@/hooks";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useFormContext } from "react-hook-form";
import * as Dialog from "@radix-ui/react-dialog";
import * as HoverCard from "@radix-ui/react-hover-card";
import { X } from "lucide-react";

interface Props {
  title: string;
  multiple?: boolean;
  formField: string;
}

export type FormImageUploadRef = {
  uploadImage: () => Promise<string>;
  getFiles: () => File[];
};

export const FormImageUpload = forwardRef<FormImageUploadRef, Props>(
  ({ multiple, title, formField }: Props, ref) => {
    const [image, setImage] = useState<File[]>([]);
    const { watch, setValue } = useFormContext();
    const existingValue = watch(formField);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

    useImperativeHandle(ref, () => {
      return {
        uploadImage: async () => {
          // If no new images uploaded, return existing value
          if (image.length === 0) {
            return existingValue || "";
          }
          // Otherwise upload new images
          const allLink: string[] = [];
          for (const img of image) {
            allLink.push(await uploadImage(img));
          }
          return allLink.join("\n");
        },
        getFiles: () => image,
      };
    }, [image, existingValue]);

    // Parse existing URLs (can be newline-separated for multiple images)
    const existingUrls = existingValue
      ? existingValue.split("\n").filter((url: string) => url.trim() !== "")
      : [];

    const handleDeleteExistingImage = (index: number) => {
      const updatedUrls = existingUrls.filter((_, i) => i !== index);
      setValue(formField, updatedUrls.join("\n"));
      setDeleteIndex(null);
    };

    return (
      <ImageUpload setValue={setImage} multiple={multiple}>
        <div className="flex flex-col gap-4">
          <ImageUpload.UploadBox title={title} />

          {/* Show existing images (always visible if they exist) */}
          {existingUrls.length > 0 && (
            <div className="grid gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-gray-300">
                  原本的圖片:
                </div>
                {image.length > 0 && (
                  <div className="text-xs text-yellow-400">(將會被替換)</div>
                )}
              </div>
              <div className="grid gap-2 p-3 bg-gray-800/50 rounded border border-gray-700">
                {existingUrls.map((url: string, index: number) => (
                  <div key={index} className="relative">
                    <HoverCard.Root>
                      <HoverCard.Trigger asChild>
                        <img
                          src={url}
                          alt={`Existing ${title}`}
                          className="w-full max-w-md rounded cursor-pointer"
                        />
                      </HoverCard.Trigger>
                      <HoverCard.Portal>
                        <HoverCard.Content
                          avoidCollisions={false}
                          hideWhenDetached={true}
                          align="end"
                          side="top"
                        >
                          <Dialog.Root
                            open={deleteIndex === index}
                            onOpenChange={(open) =>
                              setDeleteIndex(open ? index : null)
                            }
                          >
                            <Dialog.Trigger asChild>
                              <button
                                type="button"
                                className="relative rounded-xl bg-[#FF4C4C] p-2 hover:bg-[#FF3333] transition-colors"
                              >
                                <X size={16} color="#ffffff" />
                              </button>
                            </Dialog.Trigger>
                            <Dialog.Portal>
                              <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-700 shadow-xl">
                                <Dialog.Title className="text-lg font-semibold text-white mb-2">
                                  確認刪除圖片
                                </Dialog.Title>
                                <Dialog.Description className="text-sm text-gray-400 mb-6">
                                  確定要刪除這張圖片嗎？此操作無法復原。
                                </Dialog.Description>
                                <div className="flex gap-3 justify-end">
                                  <Dialog.Close asChild>
                                    <button
                                      type="button"
                                      className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                                    >
                                      取消
                                    </button>
                                  </Dialog.Close>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteExistingImage(index)
                                    }
                                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                                  >
                                    確認刪除
                                  </button>
                                </div>
                              </Dialog.Content>
                            </Dialog.Portal>
                          </Dialog.Root>
                        </HoverCard.Content>
                      </HoverCard.Portal>
                    </HoverCard.Root>
                  </div>
                ))}
              </div>
            </div>
          )}
          {image.length > 0 && (
            <div className="grid gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-green-400">
                  新上傳的圖片:
                </div>
                <div className="text-xs text-green-300">(點擊提交後套用)</div>
              </div>
              <div className="grid gap-2 p-3 bg-green-900/20 rounded border border-green-700">
                <ImageUpload.ResultBox />
              </div>
            </div>
          )}
        </div>
      </ImageUpload>
    );
  },
);
