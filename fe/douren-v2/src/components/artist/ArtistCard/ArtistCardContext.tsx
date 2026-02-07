import { createContext, useContext, useMemo, useState } from "react";
import type { ArtistViewModel } from "@/types/models";

export interface ArtistCardRootProps {
  artist: ArtistViewModel;
  bookmarks: Set<number>;
  onBookmarkToggle: (id: number) => void;
  selectedTag?: string;
  children: React.ReactNode;
}

interface ArtistCardContextValue {
  artist: ArtistViewModel;
  isOpen: boolean;
  toggle: () => void;
  bookmarks: Set<number>;
  onBookmarkToggle: (id: number) => void;
  selectedTag?: string;
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
  selectedTag,
  children,
}: ArtistCardRootProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const value = useMemo(
    () => ({
      artist,
      isOpen,
      toggle: () => setIsOpen((prev) => !prev),
      bookmarks,
      onBookmarkToggle,
      selectedTag,
    }),
    [artist, isOpen, bookmarks, onBookmarkToggle, selectedTag],
  );

  return (
    <ArtistCardContext.Provider value={value}>
      <div className="border-b border-archive-border group relative">
        {children}
      </div>
    </ArtistCardContext.Provider>
  );
};
