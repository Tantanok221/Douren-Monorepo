import { describe, expect, it } from "vitest";
import { APIError } from "better-auth";

import { createSignupError, SIGNUP_ERROR_MESSAGE } from "../auth";

describe("createSignupError", () => {
	it("returns a generic signup error without enumeration", () => {
		const error = createSignupError();

		expect(error).toBeInstanceOf(APIError);
		expect(error.message).toBe(SIGNUP_ERROR_MESSAGE);
	});
});
