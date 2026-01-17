import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { useRef } from "react";
import { FormImageUploadRef } from "@/components";

interface ImageResponse {
  link: string;
}
export const useUploadImageMutation = () => {
  return useMutation({
    mutationFn: async (file: File | null) => {
      return uploadImage(file);
    },
  });
};

export const useUploadImageRef = () => {
  return useRef<FormImageUploadRef>(null!);
};

export async function uploadImage(file: File | null): Promise<string> {
  if (!file) throw new Error("No file provided");
  const formData = new FormData();
  formData.append("image", file);
  const { link } = await ky
    .post<ImageResponse>(import.meta.env.VITE_IMAGE_URL, {
      body: formData,
      headers: {
        Authorization: import.meta.env.VITE_IMAGE_URL_TOKEN,
      },
    })
    .json();
  return link;
}
