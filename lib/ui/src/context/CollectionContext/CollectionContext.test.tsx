import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, renderHook, act } from "@testing-library/react";
import {
  CollectionContextProvider,
  CollectionContext,
} from "./CollectionContext";
import type { eventArtistBaseSchemaType } from "@pkg/type";
import { mockArtistEventData, mockArtistEventData2 } from "../../mockData.ts";
import { useCollectionProvider } from "./useCollectionContext.ts";

// Mock localStorage
const localStorageMock = {
  store: {} as { [key: string]: string },
  getItem(key: string) {
    return this.store[key] || null;
  },
  setItem(key: string, value: string) {
    this.store[key] = value;
  },
  clear() {
    this.store = {};
  },
};

vi.stubGlobal("localStorage", localStorageMock);

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <CollectionContextProvider keys="test-key">
    {children}
  </CollectionContextProvider>
);

describe("CollectionContext and useCollectionProvider", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("should initialize with empty array from localStorage", () => {
    const { result } = renderHook(() => useCollectionProvider(), {
      wrapper: TestWrapper,
    });

    const [collection] = result.current;
    expect(collection).toEqual([]);
  });

  it("should add item to collection", () => {
    const { result } = renderHook(() => useCollectionProvider(), {
      wrapper: TestWrapper,
    });

    act(() => {
      const [, dispatch] = result.current;
      dispatch({
        action: "add",
        keys: "test-key",
        data: mockArtistEventData,
      });
    });

    const [collection] = result.current;
    expect(collection).toHaveLength(1);
    expect(collection?.[0].boothName).toBe("JENˇ/荏");

    // Verify localStorage was updated
    const storedData = JSON.parse(localStorageMock.getItem("test-key") || "[]");
    expect(storedData).toHaveLength(1);
    expect(storedData[0].boothName).toBe("JENˇ/荏");
  });

  it("should remove item from collection", () => {
    // Initialize localStorage with data
    localStorageMock.setItem(
      "test-key",
      JSON.stringify([mockArtistEventData, mockArtistEventData2]),
    );

    const { result } = renderHook(() => useCollectionProvider(), {
      wrapper: TestWrapper,
    });

    act(() => {
      const [, dispatch] = result.current;
      dispatch({
        action: "remove",
        keys: "test-key",
        data: mockArtistEventData,
      });
    });

    const [collection] = result.current;
    expect(collection).toHaveLength(1);
    expect(collection?.[0].boothName).toBe("JEN");

    // Verify localStorage was updated
    const storedData = JSON.parse(localStorageMock.getItem("test-key") || "[]");
    expect(storedData).toHaveLength(1);
    expect(storedData[0].boothName).toBe("JEN");
  });

  it("should throw error when hook is used outside provider", () => {
    expect(() => {
      renderHook(() => useCollectionProvider());
    }).toThrow("useCollectionProvider must be used within CollectionProvider");
  });

  it("should handle multiple add operations", () => {
    const { result } = renderHook(() => useCollectionProvider(), {
      wrapper: TestWrapper,
    });

    act(() => {
      const [, dispatch] = result.current;
      dispatch({
        action: "add",
        keys: "test-key",
        data: mockArtistEventData,
      });
      dispatch({
        action: "add",
        keys: "test-key",
        data: mockArtistEventData2,
      });
    });

    const [collection] = result.current;
    expect(collection).toHaveLength(2);
    expect(collection?.[0].boothName).toBe("JENˇ/荏");
    expect(collection?.[1].boothName).toBe("JEN");
  });

  it("should handle undefined data gracefully", () => {
    const { result } = renderHook(() => useCollectionProvider(), {
      wrapper: TestWrapper,
    });

    act(() => {
      const [, dispatch] = result.current;
      dispatch({
        action: "add",
        keys: "test-key",
        data: undefined,
      });
    });

    const [collection] = result.current;
    expect(collection).toEqual([]);
  });
});
