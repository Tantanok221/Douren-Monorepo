import { config } from "dotenv";
import { describe, expect, it } from "vitest";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import { s as dbSchema } from "@pkg/database/db";

config({ path: ".dev.vars" });

const databaseUrl = process.env.DATABASE_URL;
const hasDatabase = typeof databaseUrl === "string" && databaseUrl.length > 0;

const testFn = hasDatabase ? it : it.skip;

describe("verification expiry timestamps", () => {
	testFn("stores expiresAt in UTC so future timestamps stay in the future", async () => {
		const db = drizzle(neon(databaseUrl as string), { schema: dbSchema });
		const token = `test-expiry-${randomUUID()}`;
		const identifier = `reset-password:${token}`;
		const expiresAt = new Date(Date.now() + 60_000);

		await db.insert(dbSchema.verification).values({
			id: randomUUID(),
			identifier,
			value: "test-user",
			expiresAt,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		try {
			const [record] = await db
				.select()
				.from(dbSchema.verification)
				.where(eq(dbSchema.verification.identifier, identifier))
				.limit(1);

			expect(record).toBeTruthy();
			expect(record?.expiresAt instanceof Date).toBe(true);
			expect(record?.expiresAt.getTime()).toBeGreaterThan(Date.now());
		} finally {
			await db
				.delete(dbSchema.verification)
				.where(eq(dbSchema.verification.identifier, identifier));
		}
	});
});
