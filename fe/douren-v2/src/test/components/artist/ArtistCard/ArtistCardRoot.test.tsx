import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ArtistViewModel } from "@/types/models";
import { ArtistCardRoot } from "@/components/artist/ArtistCard/ArtistCardContext";

const { navigateMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
}));

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-router")>(
    "@tanstack/react-router",
  );

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const baseArtist: ArtistViewModel = {
  id: 24,
  name: "Clicked Artist",
  handle: "clicked-artist",
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

describe("ArtistCardRoot", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    window.history.replaceState({}, "", "/");
  });

  it("navigates to the clicked artist page with the current event context", () => {
    window.history.replaceState({}, "", "/events/FF42");

    const { container } = render(
      <ArtistCardRoot
        artist={baseArtist}
        bookmarks={new Set<number>()}
        onBookmarkToggle={() => {}}
      >
        <div>Card content</div>
      </ArtistCardRoot>,
    );

    fireEvent.click(container.firstElementChild as HTMLElement);

    expect(navigateMock).toHaveBeenCalledWith({
      to: "/artists/$artistId",
      params: { artistId: "24" },
      search: { eventName: "FF42" },
    });
  });
});
