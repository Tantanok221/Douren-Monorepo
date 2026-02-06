import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { motion } from 'framer-motion';
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };
  if (totalPages <= 1) return null;
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 pb-4 border-t border-archive-border">
      {/* Results Info */}
      <div className="text-sm font-mono text-archive-text/60">
        Showing <span className="text-archive-text">{startItem}</span> to{' '}
        <span className="text-archive-text">{endItem}</span> of{' '}
        <span className="text-archive-text">{totalItems}</span> artists
      </div>

      {/* Page Navigation */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="group p-2 rounded-sm border border-archive-border hover:border-archive-accent hover:bg-archive-hover/50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-archive-border disabled:hover:bg-transparent transition-all duration-300"
          aria-label="Previous page">

          <ChevronLeftIcon
            size={16}
            className="text-archive-text group-hover:text-archive-accent group-hover:-translate-x-0.5 transition-all duration-300" />

        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-sm font-mono text-archive-text/40">

                  ...
                </span>);

            }
            const pageNum = page as number;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`relative px-3 py-2 text-sm font-mono rounded-sm transition-all duration-300 ${isActive ? 'text-archive-text bg-archive-accent/10' : 'text-archive-text/60 hover:text-archive-text hover:bg-archive-hover/50'}`}>

                {pageNum}
                {isActive &&
                <motion.div
                  layoutId="activePage"
                  className="absolute inset-0 border border-archive-accent rounded-sm"
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30
                  }} />

                }
              </button>);

          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="group p-2 rounded-sm border border-archive-border hover:border-archive-accent hover:bg-archive-hover/50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-archive-border disabled:hover:bg-transparent transition-all duration-300"
          aria-label="Next page">

          <ChevronRightIcon
            size={16}
            className="text-archive-text group-hover:text-archive-accent group-hover:translate-x-0.5 transition-all duration-300" />

        </button>
      </div>
    </div>);

}