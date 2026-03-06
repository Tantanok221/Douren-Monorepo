import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ArtistViewModel } from "@/types/models";
import { ArtistCardRoot } from "@/components/artist/ArtistCard/ArtistCardContext";
import { ArtistCardSummary } from "@/components/artist/ArtistCard/ArtistCardSummary";

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

  it("falls back to no-image placeholder when artist image fails to load", () => {
    render(
      <ArtistCardRoot
        artist={{
          ...baseArtist,
          name: "Broken Image Artist",
          imageUrl: "https://example.com/missing-image.png",
        }}
        bookmarks={new Set<number>()}
        onBookmarkToggle={() => {}}
        selectedTags={[]}
      >
        <ArtistCardSummary />
      </ArtistCardRoot>,
    );

    const image = screen.getByRole("img", { name: "Broken Image Artist" });
    fireEvent.error(image);

    expect(image.getAttribute("src")).toContain("data:image/svg+xml");
  });

  it("does not render expand-collapse icons for static layout", () => {
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

    expect(container.querySelector(".lucide-plus")).toBeNull();
    expect(container.querySelector(".lucide-minus")).toBeNull();
  });

  it("renders day blocks on the left summary column without Event DM heading", () => {
    render(
      <ArtistCardRoot
        artist={{
          ...baseArtist,
          boothLocations: { day1: "A01", day2: "", day3: "C22" },
        }}
        bookmarks={new Set<number>()}
        onBookmarkToggle={() => {}}
        selectedTags={[]}
      >
        <ArtistCardSummary />
      </ArtistCardRoot>,
    );

    expect(screen.queryByText("Event DM")).toBeNull();
    expect(screen.queryAllByText("第一天").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("A01").length).toBeGreaterThan(0);
  });
});
