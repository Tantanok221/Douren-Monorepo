import { describe, expect, it } from "vitest";
import {
  DAY_FILTER_COLOR_CLASSES,
  getEventChangeRoute,
  getEventNavLinkColorClass,
  isEventRoutePath,
  shouldShowEventContextBar,
  getEventSelectorColorClass,
  Layout,
} from "./Layout";

describe("Layout day filter color convention", () => {
  it("exposes decoupled global header and event context bar components", () => {
    const layout = Layout as unknown as Record<string, unknown>;

    expect(layout.GlobalHeader).toBeTypeOf("function");
    expect(layout.EventContextBar).toBeTypeOf("function");
    expect(layout.Header).toBeUndefined();
  });

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

  it("detects event routes by /events/ prefix", () => {
    expect(isEventRoutePath("/events/cwt")).toBe(true);
    expect(isEventRoutePath("/")).toBe(false);
  });

  it("shows event context bar only when route is /events/* and selected event exists", () => {
    const selectedEvent = { id: 1, name: "cwt68", code: "CWT68" };

    expect(shouldShowEventContextBar("/events/cwt68", selectedEvent)).toBe(
      true,
    );
    expect(shouldShowEventContextBar("/events/cwt68")).toBe(false);
    expect(shouldShowEventContextBar("/", selectedEvent)).toBe(false);
  });

  it("preserves current event subroute when switching events", () => {
    expect(getEventChangeRoute(false)).toBe("/events/$eventName");
    expect(getEventChangeRoute(true)).toBe("/events/$eventName/bookmarks");
  });
});
