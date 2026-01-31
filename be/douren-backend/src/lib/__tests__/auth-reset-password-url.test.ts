import { describe, expect, it } from "vitest";

import type { ENV_BINDING } from "@pkg/env/constant";
import { getCmsResetPasswordUrl } from "../auth";

const createEnv = (overrides: Partial<ENV_BINDING> = {}) =>
	({
		DEV_ENV: "prod",
		CMS_FRONTEND_URL: "https://cms.example.com",
		...overrides,
	} as ENV_BINDING);

describe("getCmsResetPasswordUrl", () => {
	it("does not append apiBase to reset link", () => {
		const env = createEnv();
		const url = getCmsResetPasswordUrl(
			env,
			"token-123",
			"https://api.example.com/api/auth/reset-password/token-123",
		);

		expect(url).toBe("https://cms.example.com/reset-password?token=token-123");
		expect(url).not.toContain("apiBase=");
	});
});
