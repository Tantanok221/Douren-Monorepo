type RateLimitEntry = {
	count: number;
	resetAt: number;
};

export type RateLimitResult = {
	allowed: boolean;
	remaining: number;
	resetAt: number;
};

type RateLimitOptions = {
	windowMs: number;
	max: number;
	now?: () => number;
};

export const createMemoryRateLimiter = (
	options: RateLimitOptions,
): ((key: string) => RateLimitResult) => {
	const { windowMs, max, now = () => Date.now() } = options;
	const entries = new Map<string, RateLimitEntry>();

	return (key: string) => {
		const timestamp = now();
		const existing = entries.get(key);

		if (!existing || timestamp >= existing.resetAt) {
			const resetAt = timestamp + windowMs;
			entries.set(key, { count: 1, resetAt });
			return {
				allowed: true,
				remaining: Math.max(max - 1, 0),
				resetAt,
			};
		}

		if (existing.count >= max) {
			return {
				allowed: false,
				remaining: 0,
				resetAt: existing.resetAt,
			};
		}

		const updatedCount = existing.count + 1;
		const remaining = Math.max(max - updatedCount, 0);
		entries.set(key, { ...existing, count: updatedCount });

		return {
			allowed: true,
			remaining,
			resetAt: existing.resetAt,
		};
	};
};
