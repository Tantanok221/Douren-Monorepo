import { describe, it, expect } from "vitest";
import type { eventArtistBaseSchemaType } from "@pkg/type";
import {
  dedupeArtistsById,
  toArtistViewModel,
  toEventViewModel,
} from "./adapters";
import type { ArtistViewModel } from "@/types/models";

describe("adapters", () => {
  it("maps event artist data to ArtistViewModel with fallbacks", () => {
    const input: eventArtistBaseSchemaType = {
      uuid: 42,
      author: "Stellar Works",
      introduction: "Space-themed illustrations.",
      twitterLink: "https://twitter.com/stellar",
      youtubeLink: null,
      facebookLink: null,
      instagramLink: "https://instagram.com/stellar",
      pixivLink: "https://pixiv.net/stellar",
      plurkLink: null,
      bahaLink: null,
      twitchLink: null,
      myacgLink: "https://myacg.net/stellar",
      storeLink: "https://store.example.com",
      officialLink: "https://official.example.com",
      photo: null,
      tags: [
        { tag: "Illustration", count: 10, index: 1 },
        { tag: "Space", count: 5, index: 0 },
      ],
      boothName: "E15",
      locationDay01: "E15",
      locationDay02: null,
      locationDay03: "",
      DM: null,
    };

    const result = toArtistViewModel(input);

    expect(result.id).toBe(42);
    expect(result.name).toBe("Stellar Works");
    expect(result.handle).toBe("E15");
    expect(result.boothLocations).toEqual({
      day1: "E15",
      day2: "",
      day3: "",
    });
    expect(result.tags).toEqual(["Space", "Illustration"]);
    expect(result.bio).toBe("Space-themed illustrations.");
    expect(result.imageUrl).toContain("data:image/svg+xml");
    expect(result.socials).toEqual({
      twitter: "https://twitter.com/stellar",
      instagram: "https://instagram.com/stellar",
      facebook: undefined,
      pixiv: "https://pixiv.net/stellar",
      plurk: undefined,
      website: "https://official.example.com",
    });
  });

  it("derives event codes from names when possible", () => {
    const result = toEventViewModel({ id: 5, name: "Fancy Frontier 44" });
    expect(result.code).toBe("FF44");
    expect(result.name).toBe("Fancy Frontier 44");
  });

  it("deduplicates artist view models by id while preserving order", () => {
    const artists: ArtistViewModel[] = [
      {
        id: 10,
        name: "Alpha",
        handle: "@alpha",
        boothLocations: { day1: "", day2: "", day3: "" },
        tags: [],
        bio: "",
        imageUrl: "",
        workImages: [],
        socials: {},
      },
      {
        id: 10,
        name: "Alpha Duplicate",
        handle: "@alpha-dup",
        boothLocations: { day1: "", day2: "", day3: "" },
        tags: [],
        bio: "",
        imageUrl: "",
        workImages: [],
        socials: {},
      },
      {
        id: 11,
        name: "Beta",
        handle: "@beta",
        boothLocations: { day1: "", day2: "", day3: "" },
        tags: [],
        bio: "",
        imageUrl: "",
        workImages: [],
        socials: {},
      },
    ];

    expect(dedupeArtistsById(artists)).toEqual([artists[0], artists[2]]);
  });
});
