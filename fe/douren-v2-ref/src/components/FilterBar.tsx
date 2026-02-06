import React from 'react';
import { SearchIcon, ChevronDownIcon } from 'lucide-react';
import { motion } from 'framer-motion';
interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortChange: (order: 'asc' | 'desc') => void;
  selectedTag: string;
  onTagChange: (tag: string) => void;
  availableTags: string[];
}
export function FilterBar({
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortChange,
  selectedTag,
  onTagChange,
  availableTags
}: FilterBarProps) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
      {/* Search */}
      <div className="col-span-1 md:col-span-6 relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-4 w-4 text-archive-text/40 group-focus-within:text-archive-accent transition-colors duration-300" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search artist or booth..."
          className="block w-full pl-10 pr-3 py-2 border-b border-archive-border bg-transparent text-archive-text placeholder-archive-text/40 focus:outline-none focus:border-archive-accent transition-colors duration-300 font-mono text-sm" />

      </div>

      {/* Sort */}
      <div className="col-span-1 md:col-span-3 relative">
        <div className="relative group">
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value as 'asc' | 'desc')}
            className="block w-full pl-3 pr-10 py-2 border-b border-archive-border bg-transparent text-archive-text focus:outline-none focus:border-archive-accent transition-colors duration-300 font-mono text-sm appearance-none cursor-pointer hover:bg-archive-hover/30">

            <option value="asc">Name (A-Z)</option>
            <option value="desc">Name (Z-A)</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <ChevronDownIcon className="h-4 w-4 text-archive-text/40 group-hover:text-archive-accent group-hover:translate-y-0.5 transition-all duration-300" />
          </div>
        </div>
      </div>

      {/* Tag Filter */}
      <div className="col-span-1 md:col-span-3 relative">
        <div className="relative group">
          <select
            value={selectedTag}
            onChange={(e) => onTagChange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 border-b border-archive-border bg-transparent text-archive-text focus:outline-none focus:border-archive-accent transition-colors duration-300 font-mono text-sm appearance-none cursor-pointer hover:bg-archive-hover/30">

            <option value="All">All Tags</option>
            {availableTags.map((tag) =>
            <option key={tag} value={tag}>
                {tag}
              </option>
            )}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <ChevronDownIcon className="h-4 w-4 text-archive-text/40 group-hover:text-archive-accent group-hover:translate-y-0.5 transition-all duration-300" />
          </div>
        </div>
      </div>
    </div>);

}