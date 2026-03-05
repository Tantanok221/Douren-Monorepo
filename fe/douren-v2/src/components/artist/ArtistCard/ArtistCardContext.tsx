import { createContext, useContext, useMemo } from "react";
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

  return (
    <ArtistCardContext.Provider value={value}>
      <div className="border-b border-archive-border relative py-5 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {children}
      </div>
    </ArtistCardContext.Provider>
  );
};
