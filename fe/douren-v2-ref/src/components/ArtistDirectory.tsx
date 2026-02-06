import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArtistRow } from './ArtistRow';
import { FilterBar } from './FilterBar';
import { Pagination } from './Pagination';
import { Artist } from '../types';
interface ArtistDirectoryProps {
  artists: Artist[];
  bookmarkedIds: Set<string>;
  onBookmarkToggle: (id: string) => void;
}
const ITEMS_PER_PAGE = 10;
const days = ['全部', '第一天', '第二天', '第三天'];
export function ArtistDirectory({
  artists,
  bookmarkedIds,
  onBookmarkToggle
}: ArtistDirectoryProps) {
  const [activeFilter, setActiveFilter] = useState('全部');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedTag, setSelectedTag] = useState('全部');
  const [currentPage, setCurrentPage] = useState(1);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0
  });
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // Extract unique tags for filter
  const allTags = useMemo(
    () => Array.from(new Set(artists.flatMap((artist) => artist.tags))).sort(),
    [artists]
  );
  // Update indicator position when active filter changes
  useEffect(() => {
    const activeIndex = days.indexOf(activeFilter);
    const activeButton = buttonRefs.current[activeIndex];
    if (activeButton) {
      setIndicatorStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth
      });
    }
  }, [activeFilter]);
  // Filter and Sort Logic
  const filteredArtists = useMemo(() => {
    const filtered = artists.
    filter((artist) => {
      // Day Filter
      if (activeFilter !== '全部') {
        const dayMap: Record<string, keyof typeof artist.boothLocations> = {
          第一天: 'day1',
          第二天: 'day2',
          第三天: 'day3'
        };
        const dayKey = dayMap[activeFilter];
        if (!artist.boothLocations[dayKey]) return false;
      }
      // Tag Filter
      if (selectedTag !== '全部' && !artist.tags.includes(selectedTag)) {
        return false;
      }
      // Search Filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          artist.name.toLowerCase().includes(query) ||
          artist.handle.toLowerCase().includes(query) ||
          artist.boothLocations.day1.toLowerCase().includes(query) ||
          artist.boothLocations.day2.toLowerCase().includes(query) ||
          artist.boothLocations.day3.toLowerCase().includes(query));

      }
      return true;
    }).
    sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortOrder === 'asc' ?
      nameA.localeCompare(nameB) :
      nameB.localeCompare(nameA);
    });
    return filtered;
  }, [artists, activeFilter, searchQuery, sortOrder, selectedTag]);
  // Pagination Logic
  const totalPages = Math.ceil(filteredArtists.length / ITEMS_PER_PAGE);
  const paginatedArtists = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredArtists.slice(startIndex, endIndex);
  }, [filteredArtists, currentPage]);
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery, sortOrder, selectedTag]);
  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  const handleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onBookmarkToggle(id);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return (
    <>
      {/* Day Filters */}
      <div className="relative flex gap-4 mb-8 border-b border-archive-border overflow-x-auto">
        <div className="flex gap-4 pb-4">
          {days.map((day, index) => {
            const isActive = activeFilter === day;
            return (
              <button
                key={day}
                ref={(el) => buttonRefs.current[index] = el}
                onClick={() => setActiveFilter(day)}
                className={`relative text-sm font-sans tracking-wider transition-all duration-300 py-2 px-4 rounded-sm whitespace-nowrap ${isActive ? 'text-archive-text bg-archive-accent/15' : 'text-archive-text/40 hover:text-archive-text/70 hover:bg-archive-hover/50'}`}>

                {day}
              </button>);

          })}
        </div>
        <motion.div
          className="absolute bottom-0 h-0.5 bg-archive-accent"
          animate={{
            left: indicatorStyle.left,
            width: indicatorStyle.width
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }} />

      </div>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        availableTags={allTags} />


      {/* Artist List */}
      <motion.div layout className="flex flex-col min-h-[400px]">
        {paginatedArtists.length > 0 ?
        paginatedArtists.map((artist) =>
        <ArtistRow
          key={artist.id}
          artist={artist}
          isOpen={expandedId === artist.id}
          isBookmarked={bookmarkedIds.has(artist.id)}
          onToggle={() => handleToggle(artist.id)}
          onBookmark={(e) => handleBookmark(e, artist.id)}
          selectedTag={selectedTag !== '全部' ? selectedTag : undefined} />

        ) :

        <div className="py-20 text-center flex flex-col items-center justify-center text-archive-text/40">
            <span className="font-sans text-lg mb-2">找不到創作者</span>
            <span className="text-sm">請嘗試調整您的篩選條件或搜尋關鍵字</span>
          </div>
        }
      </motion.div>

      {/* Pagination */}
      {filteredArtists.length > 0 &&
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={filteredArtists.length} />

      }
    </>);

}