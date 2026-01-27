import { ImageUpload } from "../../ImageUpload";
import { uploadImage } from "@/hooks";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useFormContext } from "react-hook-form";

interface Props {
  title: string;
  multiple?: boolean;
  formField: string;
}

export type FormImageUploadRef = {
  uploadImage: () => Promise<string>;
};

export const FormImageUpload = forwardRef<FormImageUploadRef, Props>(
  ({ multiple, title, formField }: Props, ref) => {
    const [image, setImage] = useState<File[]>([]);
    const { watch } = useFormContext();
    const existingValue = watch(formField);

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
      };
    }, [image, existingValue]);

    // Parse existing URLs (can be newline-separated for multiple images)
    const existingUrls = existingValue
      ? existingValue.split("\n").filter((url: string) => url.trim() !== "")
      : [];

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
                  <div className="text-xs text-yellow-400">
                    (將會被替換)
                  </div>
                )}
              </div>
              <div className="grid gap-2 p-3 bg-gray-800/50 rounded border border-gray-700">
                {existingUrls.map((url: string, index: number) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Existing ${title}`}
                    className="w-full max-w-md rounded"
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Show newly uploaded images */}
          {image.length > 0 && (
            <div className="grid gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-green-400">
                  新上傳的圖片:
                </div>
                <div className="text-xs text-green-300">
                  (點擊提交後套用)
                </div>
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
