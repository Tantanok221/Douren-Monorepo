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
          {/* Show existing images if no new images uploaded */}
          {image.length === 0 && existingUrls.length > 0 && (
            <div className="grid gap-4 mt-4">
              <div className="text-sm text-gray-400">目前的圖片:</div>
              <div className="grid gap-2">
                {existingUrls.map((url: string, index: number) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Existing ${title}`}
                    className="w-full max-w-md rounded border border-gray-700"
                  />
                ))}
              </div>
            </div>
          )}
          {/* Show newly uploaded images */}
          {image.length > 0 && (
            <div className="grid gap-4 mt-4">
              <div className="text-sm text-gray-400">已上傳的圖片:</div>
              <div className="grid gap-2">
                <ImageUpload.ResultBox />
              </div>
            </div>
          )}
        </div>
      </ImageUpload>
    );
  },
);
