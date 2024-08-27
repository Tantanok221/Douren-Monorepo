import { Context } from "hono";
import { CloudflareImageResponse } from "../types/cloudflareReponse";

export async function postCloudflareImage(c: Context, image: File) {
  const uploadFormData = new FormData();
  uploadFormData.append("file", image);
  const response = await fetch(c.env.CLOUDFLARE_IMAGE_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${c.env.CLOUDFLARE_IMAGE_TOKEN}`,
    },
    body: uploadFormData,
  });
  const data = (await response.json()) as CloudflareImageResponse;
  return data;
}
