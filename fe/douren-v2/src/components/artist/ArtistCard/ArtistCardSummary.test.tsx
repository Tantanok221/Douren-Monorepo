import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ArtistViewModel } from "@/types/models";
import { ArtistCardRoot } from "./ArtistCardContext";
import { ArtistCardSummary } from "./ArtistCardSummary";

const baseArtist: ArtistViewModel = {
  id: 1,
  name: "Test Artist",
  handle: "test-handle",
  boothLocations: {
    day1: "",
    day2: "",
    day3: "",
  },
  tags: [],
  bio: "bio",
  imageUrl: "https://example.com/image.png",
  workImages: [],
  socials: {},
};

describe("ArtistCardSummary", () => {
  it("does not render tag chips when artist has no tags", () => {
    const { container } = render(
      <ArtistCardRoot
        artist={baseArtist}
        bookmarks={new Set<number>()}
        onBookmarkToggle={() => {}}
        selectedTags={[]}
      >
        <ArtistCardSummary />
      </ArtistCardRoot>,
    );

    const tagsContainer = container.querySelector(".flex-wrap.gap-1\\.5");
    expect(tagsContainer).toBeNull();
  });

  it("renders tag chips when tags exist", () => {
    const { container } = render(
      <ArtistCardRoot
        artist={{ ...baseArtist, tags: ["A", "B"] }}
        bookmarks={new Set<number>()}
        onBookmarkToggle={() => {}}
        selectedTags={[]}
      >
        <ArtistCardSummary />
      </ArtistCardRoot>,
    );

    expect(screen.queryByText("A")).not.toBeNull();
    expect(container.querySelector(".flex-wrap.gap-1\\.5")).not.toBeNull();
  });
});
