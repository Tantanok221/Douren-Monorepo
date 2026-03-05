import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ArtistViewModel } from "@/types/models";
import { ArtistCardRoot } from "./ArtistCardContext";
import { ArtistCardDetails } from "./ArtistCardDetails";

const { useQueryMock } = vi.hoisted(() => ({
  useQueryMock: vi.fn(),
}));

vi.mock("@/helper/trpc", () => ({
  trpc: {
    artist: {
      getArtistPageDetails: {
        useQuery: useQueryMock,
      },
    },
  },
}));

const baseArtist: ArtistViewModel = {
  id: 1,
  name: "Test Artist",
  handle: "test-handle",
  boothLocations: {
    day1: "A01",
    day2: "",
    day3: "",
  },
  tags: [],
  bio: "bio",
  imageUrl: "https://example.com/image.png",
  workImages: [],
  socials: {},
};

describe("ArtistCardDetails", () => {
  beforeEach(() => {
    useQueryMock.mockReset();
  });

  it("renders right-side content without requiring expand click", () => {
    useQueryMock.mockReturnValue({
      data: {
        products: [
          {
            preview: "https://example.com/work-1.png",
            thumbnail: "",
          },
        ],
      },
      isPending: false,
      isError: false,
    });

    render(
      <ArtistCardRoot
        artist={baseArtist}
        bookmarks={new Set<number>()}
        onBookmarkToggle={() => {}}
        selectedTags={[]}
      >
        <ArtistCardDetails />
      </ArtistCardRoot>,
    );

    expect(screen.queryByText("作品")).not.toBeNull();
    expect(screen.queryByText("Event DM")).toBeNull();
    expect(screen.queryByText("第一天")).toBeNull();
    expect(screen.queryByAltText("Test Artist work 1")).not.toBeNull();
  });
});
