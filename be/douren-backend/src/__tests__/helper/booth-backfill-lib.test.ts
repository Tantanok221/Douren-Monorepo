import { describe, expect, it } from "vitest";

import {
  collectBoothSeeds,
  normalizeBoothName,
  normalizeNullableText,
} from "../../../../../scripts/booth-backfill-lib.mjs";

describe("booth backfill lib", () => {
  it("normalizes empty booth names to Unknown Booth", () => {
    expect(normalizeBoothName("  ")).toBe("Unknown Booth");
    expect(normalizeBoothName(null)).toBe("Unknown Booth");
  });

  it("normalizes empty location strings to null", () => {
    expect(normalizeNullableText(" ")).toBeNull();
    expect(normalizeNullableText("A01")).toBe("A01");
  });

  it("collects unique booth seeds by event and booth name", () => {
    const seeds = collectBoothSeeds([
      {
        uuid: 1,
        eventId: 10,
        boothName: "A01",
        locationDay01: "X-1",
        locationDay02: null,
        locationDay03: null,
      },
      {
        uuid: 2,
        eventId: 10,
        boothName: " A01 ",
        locationDay01: "",
        locationDay02: "X-2",
        locationDay03: null,
      },
      {
        uuid: 3,
        eventId: 10,
        boothName: "B02",
        locationDay01: null,
        locationDay02: null,
        locationDay03: null,
      },
    ]);

    expect(seeds).toHaveLength(2);
    expect(seeds.find((seed) => seed.name === "A01")).toMatchObject({
      eventId: 10,
      name: "A01",
      locationDay01: "X-1",
      locationDay02: "X-2",
    });
  });
});
