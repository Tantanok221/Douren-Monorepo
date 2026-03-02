import { describe, expect, it } from "vitest";
import {
  DAY_FILTER_COLOR_CLASSES,
  getEventNavLinkColorClass,
  getEventSelectorColorClass,
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
});
