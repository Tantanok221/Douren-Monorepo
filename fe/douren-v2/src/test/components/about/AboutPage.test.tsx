import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AboutPage } from "@/components/about/AboutPage";

const { useQueryMock } = vi.hoisted(() => ({
  useQueryMock: vi.fn(),
}));

vi.mock("@/helper/trpc", () => ({
  trpc: {
    owner: {
      getOwner: {
        useQuery: useQueryMock,
      },
    },
  },
}));

const owners = [
  {
    id: 2,
    name: "小黑蚊",
    title: "主要管理者/資訊整理者",
    description: null,
    twitterName: "小黑蚊",
    twitterLink: "https://twitter.com/example",
    githubName: null,
    githubLink: null,
    discordName: "lbm_1749",
  },
  {
    id: 1,
    name: "Stangen",
    title: "網頁開發/UIUX",
    description: "Builds the site.",
    twitterName: null,
    twitterLink: null,
    githubName: "Tantanok221",
    githubLink: "https://github.com/Tantanok221",
    discordName: null,
  },
];

describe("AboutPage", () => {
  beforeEach(() => {
    useQueryMock.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders every owner with their title, description and links", () => {
    useQueryMock.mockReturnValue({
      data: owners,
      isPending: false,
      isError: false,
    });

    render(<AboutPage />);

    expect(screen.getByText("關於我們")).toBeTruthy();
    expect(screen.getByText("主要管理者/資訊整理者")).toBeTruthy();
    expect(screen.getByText("Builds the site.")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /小黑蚊/ }).getAttribute("href"),
    ).toBe("https://twitter.com/example");
    expect(
      screen.getByRole("link", { name: /Tantanok221/ }).getAttribute("href"),
    ).toBe("https://github.com/Tantanok221");
  });

  it("copies the Discord name and confirms it", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    useQueryMock.mockReturnValue({
      data: owners,
      isPending: false,
      isError: false,
    });

    render(<AboutPage />);
    fireEvent.click(screen.getByRole("button", { name: /lbm_1749/ }));

    expect(writeText).toHaveBeenCalledWith("lbm_1749");
    await waitFor(() =>
      expect(screen.getByText("已複製 Discord 名稱")).toBeTruthy(),
    );
  });

  it("shows an error message when owners fail to load", () => {
    useQueryMock.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
    });

    render(<AboutPage />);

    expect(screen.getByText(/無法載入資料/)).toBeTruthy();
  });
});
