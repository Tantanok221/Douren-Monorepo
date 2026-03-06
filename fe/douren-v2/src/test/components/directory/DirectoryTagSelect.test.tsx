import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Directory } from "@/components/directory/Directory";

describe("Directory.TagSelect", () => {
  it("does not render selected tag text below the closed selector", () => {
    render(
      <Directory.Root availableTags={["Space", "Illustration"]}>
        <Directory.TagSelect />
      </Directory.Root>,
    );

    fireEvent.click(screen.getByRole("button", { name: "全部標籤" }));
    fireEvent.click(screen.getByRole("button", { name: "Space" }));

    expect(
      screen.getByRole("button", { name: "已選擇 1 個標籤" }),
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "已選擇 1 個標籤" }));

    expect(screen.queryByText("Space")).toBeNull();
  });

  it("does not render the empty tag message below the closed selector", () => {
    render(
      <Directory.Root availableTags={[]}>
        <Directory.TagSelect />
      </Directory.Root>,
    );

    expect(screen.getByRole("button", { name: "全部標籤" })).toBeTruthy();
    expect(screen.queryByText("暫無可用標籤")).toBeNull();
  });
});
