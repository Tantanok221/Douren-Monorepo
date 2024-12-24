import { useMutation } from "@tanstack/react-query";
import ky from "ky";

interface ImageResponse {
  link: string;
}
export const useUploadImage = () => {
  return useMutation({
    mutationFn: async (file: File | null) => {
      return uploadImage(file);
    },
  });
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
