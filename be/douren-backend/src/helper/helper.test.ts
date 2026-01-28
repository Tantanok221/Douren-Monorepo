import { describe, expect, it } from "vitest";
import { processTagConditions } from "./processTagConditions";
import { eq } from "drizzle-orm";
import { s } from "@pkg/database/db";
describe("Test processTagCondition", () => {
	it("Should return the correct conditions", () => {
		const output = processTagConditions("a,b");
		expect(output).toEqual([
			eq(s.tag.tag, "a"),
			eq(s.tag.tag, "b"),
		]);
	});
	it("Should return nothing if theres no tag", () => {
		expect(processTagConditions("")).toEqual([]);
	});
});
