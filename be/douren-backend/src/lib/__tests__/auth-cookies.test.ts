import { describe, expect, it } from "vitest";

import type { ENV_BINDING } from "@pkg/env/constant";
import { getAuthCookieConfig } from "../auth";

const createEnv = (devEnv: string) =>
	({ DEV_ENV: devEnv } as unknown as ENV_BINDING);

describe("getAuthCookieConfig", () => {
	it("uses non-secure cookies in dev", () => {
		const env = createEnv("dev");
		const config = getAuthCookieConfig(env);

		expect(config).toEqual({
			useSecureCookies: false,
			sameSite: "lax",
			secure: false,
		});
	});

	it("uses secure cookies in prod", () => {
		const env = createEnv("prod");
		const config = getAuthCookieConfig(env);

		expect(config).toEqual({
			useSecureCookies: true,
			sameSite: "none",
			secure: true,
		});
	});
});
