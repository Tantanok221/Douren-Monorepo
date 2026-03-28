import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ArtistPage } from "@/components/artist/ArtistPage";

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

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-router")>(
    "@tanstack/react-router",
  );

  return {
    ...actual,
    Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  };
});

describe("ArtistPage", () => {
  beforeEach(() => {
    useQueryMock.mockReset();
  });

  it("loads and renders the requested artist instead of a constant artist", () => {
    useQueryMock.mockReturnValue({
      data: {
        uuid: 7,
        author: "Queried Artist",
        introduction: "Queried bio",
        photo: "https://example.com/artist.png",
        tags: "Original,Fantasy",
        boothName: null,
        plurkLink: null,
        twitterLink: "https://twitter.com/queried",
        facebookLink: null,
        instagramLink: null,
        pixivLink: null,
        officialLink: null,
        storeLink: null,
        myacgLink: null,
        products: [
          {
            preview: "https://example.com/work-1.png",
            thumbnail: "",
            title: "Work 1",
          },
        ],
        events: [],
      },
      isPending: false,
      isError: false,
    });

    render(<ArtistPage artistId="7" eventName="FF42" />);

    expect(useQueryMock).toHaveBeenCalledWith({ id: "7" });
    expect(
      screen.getByRole("heading", { level: 1, name: "Queried Artist" }),
    ).not.toBeNull();
    expect(screen.getByText("Queried bio")).not.toBeNull();
    expect(screen.getByText("No.0007")).not.toBeNull();
  });
});
