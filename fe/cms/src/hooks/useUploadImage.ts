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
  
  // Use backend endpoint which handles authentication via session
  // Strip /trpc suffix if present since image is a REST endpoint, not tRPC
  const backendUrl = import.meta.env.VITE_BACKEND_URL
    .replace(/\/+$/, "")
    .replace(/\/trpc$/, "");
  const imageEndpoint = `${backendUrl}/image`;

  const { link } = await ky
    .post<ImageResponse>(imageEndpoint, {
      body: formData,
      credentials: "include", // Send session cookies
    })
    .json();
  return link;
}
