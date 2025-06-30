import { Hono } from "hono";
import { HonoEnv } from "@/index";

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

const imageRoute = new Hono<HonoEnv>().post("/", async (c) => {
	const formData = await c.req.formData();
	const image = formData.get("image") as File | null;
	if (!image) {
		return c.json({ error: "No image file provided" }, 400);
	}
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
	const imageLink = data.result.variants[0];
	return c.json({ link: imageLink });
});

export default imageRoute;
