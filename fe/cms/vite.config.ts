import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), TanStackRouterVite()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@components": path.resolve(__dirname, "./src/components"),
		},
	},
	optimizeDeps: {
		include: ["react", "react-dom", "react/jsx-runtime"],
		exclude: [],
	},
	server: {
		port: parseInt(process.env.DEV_CMS_PORT || "5174", 10),
	},
});
