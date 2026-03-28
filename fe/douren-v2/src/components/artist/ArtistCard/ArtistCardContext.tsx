import { createContext, useContext, useMemo } from "react";
import type { MouseEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";
import type { ArtistViewModel } from "@/types/models";

export interface ArtistCardRootProps {
  artist: ArtistViewModel;
  bookmarks: Set<number>;
  onBookmarkToggle: (id: number) => void;
  selectedTags?: string[];
  children: React.ReactNode;
}

interface ArtistCardContextValue {
  artist: ArtistViewModel;
  bookmarks: Set<number>;
  onBookmarkToggle: (id: number) => void;
  selectedTags: string[];
}

const ArtistCardContext = createContext<ArtistCardContextValue | null>(null);

export const useArtistCard = (): ArtistCardContextValue => {
  const context = useContext(ArtistCardContext);
  if (!context) {
    throw new Error(
      "ArtistCard components must be used within ArtistCard.Root",
    );
  }
  return context;
};

export const ArtistCardRoot = ({
  artist,
  bookmarks,
  onBookmarkToggle,
  selectedTags = [],
  children,
}: ArtistCardRootProps) => {
  const value = useMemo(
    () => ({
      artist,
      bookmarks,
      onBookmarkToggle,
      selectedTags,
    }),
    [artist, bookmarks, onBookmarkToggle, selectedTags],
  );

  const navigate = useNavigate();
  const pathname =
    typeof window === "undefined" ? "" : window.location.pathname;
  const eventName = pathname.startsWith("/events/")
    ? decodeURIComponent(pathname.split("/")[2] ?? "")
    : "";

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button, a")) return;
    navigate({
      to: "/artists/$artistId",
      params: { artistId: String(artist.id) },
      search: eventName ? { eventName } : {},
    });
  };

  return (
    <ArtistCardContext.Provider value={value}>
      <div
        onClick={handleClick}
        className="border-b border-archive-border relative py-5 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 cursor-pointer group/card"
      >
        <div className="absolute top-5 right-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 pointer-events-none">
          <ArrowRightIcon size={14} className="text-archive-text/45" />
        </div>
        {children}
      </div>
    </ArtistCardContext.Provider>
  );
};
