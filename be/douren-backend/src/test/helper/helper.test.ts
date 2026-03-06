import { describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { s } from "@pkg/database/db";
import { processTagConditions } from "@/helper/processTagConditions";
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
