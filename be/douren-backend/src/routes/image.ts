import { BACKEND_BINDING } from "@pkg/env/constant";
import { Hono } from "hono";

export interface CloudflareImageResponse {
	result: Result;
	success: boolean;
	// errors: any[];
	// messages: any[];
}

interface Result {
	id: string;
	filename: string;
	uploaded: string; // Date string in ISO format
	requireSignedURLs: boolean;
	variants: string[];
}

const imageRoute = new Hono<{ Bindings: BACKEND_BINDING }>().post(
	"/",
	async (c) => {
		const token = c.req.header("Authorization");
		if (c.env.CLOUDFLARE_IMAGE_AUTH_TOKEN !== token) {
			return c.text("Invalid Auth");
		}
		const formData = await c.req.formData();
		const image = formData.get("image") as File | null;
		if (!image) {
			return c.json({ error: "No image file provided" }, 400);
		}
		const uploadFormData = new FormData();
		uploadFormData.append("file", image);
		console.log("IMAGE ENDPOINT: ", c.env.CLOUDFLARE_IMAGE_ENDPOINT);
		console.log("IMAGE TOKEN: ", c.env.CLOUDFLARE_IMAGE_TOKEN);
		const response = await fetch(c.env.CLOUDFLARE_IMAGE_ENDPOINT, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${c.env.CLOUDFLARE_IMAGE_TOKEN}`,
			},
			body: uploadFormData,
		});
		const data = (await response.json()) as CloudflareImageResponse;
		const imageLink = data.result.variants[0];
		return c.json({ link: imageLink });
	},
);

export default imageRoute;
