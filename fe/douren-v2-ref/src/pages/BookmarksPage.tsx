import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArtistRow } from '../components/ArtistRow';
import { Artist } from '../types';
import { BookmarkIcon } from 'lucide-react';
interface BookmarksPageProps {
  artists: Artist[];
  bookmarkedIds: Set<string>;
  onBookmarkToggle: (id: string) => void;
}
export function BookmarksPage({
  artists,
  bookmarkedIds,
  onBookmarkToggle
}: BookmarksPageProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const bookmarkedArtists = artists.filter((artist) =>
  bookmarkedIds.has(artist.id)
  );
  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  const handleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onBookmarkToggle(id);
  };
  return (
    <>
      <div className="mb-8">
        <h2 className="text-xl font-sans font-medium text-archive-text mb-2">
          Your Bookmarks
        </h2>
        <p className="text-sm font-mono text-archive-text/60">
          {bookmarkedArtists.length}{' '}
          {bookmarkedArtists.length === 1 ? 'artist' : 'artists'} saved
        </p>
      </div>

      <motion.div layout className="flex flex-col min-h-[400px]">
        {bookmarkedArtists.length > 0 ?
        bookmarkedArtists.map((artist) =>
        <ArtistRow
          key={artist.id}
          artist={artist}
          isOpen={expandedId === artist.id}
          isBookmarked={true}
          onToggle={() => handleToggle(artist.id)}
          onBookmark={(e) => handleBookmark(e, artist.id)} />

        ) :

        <div className="py-20 text-center flex flex-col items-center justify-center text-archive-text/40 border border-dashed border-archive-border rounded-sm">
            <BookmarkIcon className="w-8 h-8 mb-4 opacity-50" />
            <span className="font-mono text-lg mb-2">No bookmarks yet</span>
            <span className="text-sm">
              Bookmark artists from the directory to see them here
            </span>
          </div>
        }
      </motion.div>
    </>);

}