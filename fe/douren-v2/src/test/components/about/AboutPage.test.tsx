import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AboutPage } from "@/components/about/AboutPage";

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-router")>(
    "@tanstack/react-router",
  );

  return {
    ...actual,
    Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  };
});

describe("AboutPage", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders every owner with their title and links", () => {
    render(<AboutPage />);

    expect(screen.getByText("關於我們")).toBeTruthy();
    expect(screen.getByText("小黑蚊")).toBeTruthy();
    expect(screen.getByText("主要管理者/資訊整理者")).toBeTruthy();
    expect(screen.getByText("Stangen")).toBeTruthy();
    expect(screen.getByText("網頁開發/UIUX")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /小黑蚊/ }).getAttribute("href"),
    ).toBe("https://twitter.com/MemoriesSwords");
    expect(
      screen.getByRole("link", { name: /Tantanok221/ }).getAttribute("href"),
    ).toBe("https://github.com/Tantanok221");
  });

  it("copies the Discord name and confirms it", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<AboutPage />);
    fireEvent.click(screen.getByRole("button", { name: /lbm_1749/ }));

    expect(writeText).toHaveBeenCalledWith("lbm_1749");
    await waitFor(() =>
      expect(screen.getByText("已複製 Discord 名稱")).toBeTruthy(),
    );
  });
});
