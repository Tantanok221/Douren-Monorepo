import { describe, expect, it } from "vitest";
import {
  DAY_FILTER_COLOR_CLASSES,
  getEventSelectorStatusText,
  getEventNavLinkColorClass,
  getEventSelectorColorClass,
  isEventSelectorDisabled,
} from "./Layout";

describe("Layout day filter color convention", () => {
  it("uses the same active/inactive link colors as day tabs", () => {
    expect(getEventNavLinkColorClass(true)).toBe(
      DAY_FILTER_COLOR_CLASSES.active,
    );
    expect(getEventNavLinkColorClass(false)).toBe(
      DAY_FILTER_COLOR_CLASSES.inactive,
    );
  });

  it("uses day-tab inactive color tone for event selector", () => {
    expect(getEventSelectorColorClass()).toContain(
      DAY_FILTER_COLOR_CLASSES.inactive,
    );
  });

  it("returns loading status text while event data is loading", () => {
    expect(
      getEventSelectorStatusText({
        isLoading: true,
        hasError: false,
        eventCount: 0,
      }),
    ).toBe("活動載入中");
  });

  it("returns error status text when event fetch failed", () => {
    expect(
      getEventSelectorStatusText({
        isLoading: false,
        hasError: true,
        eventCount: 0,
      }),
    ).toBe("活動載入失敗");
  });

  it("returns empty status text when no events are available", () => {
    expect(
      getEventSelectorStatusText({
        isLoading: false,
        hasError: false,
        eventCount: 0,
      }),
    ).toBe("尚無活動");
  });

  it("returns count status text when events exist", () => {
    expect(
      getEventSelectorStatusText({
        isLoading: false,
        hasError: false,
        eventCount: 3,
      }),
    ).toBe("3 場活動");
  });

  it("disables event selector when loading, error, or no events", () => {
    expect(
      isEventSelectorDisabled({
        isLoading: true,
        hasError: false,
        eventCount: 3,
      }),
    ).toBe(true);
    expect(
      isEventSelectorDisabled({
        isLoading: false,
        hasError: true,
        eventCount: 3,
      }),
    ).toBe(true);
    expect(
      isEventSelectorDisabled({
        isLoading: false,
        hasError: false,
        eventCount: 0,
      }),
    ).toBe(true);
    expect(
      isEventSelectorDisabled({
        isLoading: false,
        hasError: false,
        eventCount: 2,
      }),
    ).toBe(false);
  });
});
