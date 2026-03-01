import { describe, expect, it } from "vitest";

import { createMemoryRateLimiter } from "../rate-limit";

describe("createMemoryRateLimiter", () => {
	it("blocks after max requests and resets after the window", () => {
		let now = 0;
		const limiter = createMemoryRateLimiter({
			windowMs: 1000,
			max: 2,
			now: () => now,
		});

		expect(limiter("ip-1").allowed).toBe(true);
		expect(limiter("ip-1").allowed).toBe(true);
		expect(limiter("ip-1").allowed).toBe(false);

		now = 1000;
		expect(limiter("ip-1").allowed).toBe(true);
	});
});
