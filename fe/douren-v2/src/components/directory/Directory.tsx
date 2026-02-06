import { motion } from "framer-motion";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { StoreApi } from "zustand";
import { useStore } from "zustand";
import type { DirectoryFilters } from "@/types/models";
import { createDirectoryStore, type DirectoryState } from "./directoryStore";

interface DirectoryRootProps {
  children: ReactNode;
  availableTags: string[];
  initialFilters?: Partial<DirectoryFilters>;
}

interface DirectoryPaginationProps {
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface DirectoryMiniPaginationProps {
  totalPages: number;
  disabled?: boolean;
}

const DirectoryContext = createContext<StoreApi<DirectoryState> | null>(null);

export const useDirectoryStore = <T,>(
  selector: (state: DirectoryState) => T,
): T => {
  const store = useContext(DirectoryContext);
  if (!store) {
    throw new Error("Directory components must be used within Directory.Root");
  }
  return useStore(store, selector);
};

const DirectoryRoot = ({
  children,
  availableTags,
  initialFilters,
}: DirectoryRootProps) => {
  const [store] = useState<StoreApi<DirectoryState>>(() =>
    createDirectoryStore(initialFilters, availableTags),
  );

  useEffect(() => {
    store.getState().setAvailableTags(availableTags);
  }, [availableTags, store]);

  return (
    <DirectoryContext.Provider value={store}>
      {children}
    </DirectoryContext.Provider>
  );
};

const DAYS = ["全部", "第一天", "第二天", "第三天"];

const DirectoryDayBar = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mb-8 border-b border-archive-border flex items-end justify-between gap-4">
      {children}
    </div>
  );
};

const DirectoryDayTabs = () => {
  const day = useDirectoryStore((state) => state.filters.day);
  const setDay = useDirectoryStore((state) => state.setDay);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = DAYS.indexOf(day);
    const activeButton = buttonRefs.current[activeIndex];
    if (activeButton) {
      setIndicatorStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
      });
    }
  }, [day]);

  return (
    <div className="relative flex gap-4 overflow-x-auto flex-1 min-w-0">
      <div className="flex gap-4 pb-4">
        {DAYS.map((tabDay, index) => {
          const isActive = day === tabDay;
          return (
            <button
              key={tabDay}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              onClick={() => setDay(tabDay)}
              className={`relative text-sm font-sans tracking-wider transition-all duration-300 py-2 px-4 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "text-archive-text"
                  : "text-archive-text/80 hover:text-archive-text/95"
              }`}
            >
              {tabDay}
            </button>
          );
        })}
      </div>
      <motion.div
        className="absolute bottom-0 h-0.5 bg-archive-text"
        animate={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </div>
  );
};

const DirectoryMiniPagination = ({
  totalPages,
  disabled = false,
}: DirectoryMiniPaginationProps) => {
  const currentPage = useDirectoryStore((state) => state.filters.page);
  const setPage = useDirectoryStore((state) => state.setPage);
  const safeTotalPages = Math.max(totalPages, 1);
  const isPrevDisabled = disabled || currentPage <= 1;
  const isNextDisabled = disabled || currentPage >= safeTotalPages;

  return (
    <div className="pb-4 flex items-center gap-2 md:gap-3 font-mono cursor-pointer">
      <button
        type="button"
        onClick={() => setPage(currentPage - 1)}
        disabled={isPrevDisabled}
        className="group p-1.5 text-archive-text/45 hover:text-archive-text disabled:text-archive-text/20 disabled:cursor-not-allowed transition-colors duration-300 cursor-pointer"
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      <span className="text-xs tracking-[0.15em] text-archive-text font-sans">
        {Math.min(currentPage, safeTotalPages)} / {safeTotalPages}
      </span>

      <button
        type="button"
        onClick={() => setPage(currentPage + 1)}
        disabled={isNextDisabled}
        className="group p-1.5 text-archive-text/45 hover:text-archive-text disabled:text-archive-text/20 disabled:cursor-not-allowed transition-colors duration-300 cursor-pointer"
        aria-label="Next page"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

const DirectoryFilterBar = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
      <DirectorySearch />
      <DirectorySortSelect />
      <DirectoryTagSelect />
    </div>
  );
};

const DirectorySearch = () => {
  const search = useDirectoryStore((state) => state.filters.search);
  const setSearch = useDirectoryStore((state) => state.setSearch);
  return (
    <div className="col-span-1 md:col-span-6 relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-4 w-4 text-archive-text/40 group-focus-within:text-archive-text transition-colors duration-300" />
      </div>
      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="搜尋創作者或攤位..."
        className="block w-full pl-10 pr-3 py-2 border-b border-archive-border bg-transparent text-archive-text placeholder-archive-text/40 focus:outline-none focus:border-archive-accent transition-colors duration-300 font-mono text-sm"
      />
    </div>
  );
};

const DirectorySortSelect = () => {
  const sort = useDirectoryStore((state) => state.filters.sort);
  const setSort = useDirectoryStore((state) => state.setSort);
  const currentOrder = sort.endsWith(",desc") ? "desc" : "asc";
  return (
    <div className="col-span-1 md:col-span-3 relative">
      <div className="relative group">
        <select
          value={currentOrder}
          onChange={(event) =>
            setSort(`Author_Main(Author),${event.target.value}`)
          }
          className="block w-full pl-3 pr-10 py-2 border-b border-archive-border bg-transparent text-archive-text focus:outline-none focus:border-archive-accent transition-colors duration-300 font-mono text-sm appearance-none cursor-pointer hover:bg-archive-hover/30"
        >
          <option value="asc">名稱（A-Z）</option>
          <option value="desc">名稱（Z-A）</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDownIcon className="h-4 w-4 text-archive-text/40 group-hover:text-archive-text group-hover:translate-y-0.5 transition-all duration-300" />
        </div>
      </div>
    </div>
  );
};

const DirectoryTagSelect = () => {
  const tag = useDirectoryStore((state) => state.filters.tag);
  const setTag = useDirectoryStore((state) => state.setTag);
  const availableTags = useDirectoryStore((state) => state.availableTags);
  return (
    <div className="col-span-1 md:col-span-3 relative">
      <div className="relative group">
        <select
          value={tag}
          onChange={(event) => setTag(event.target.value)}
          className="block w-full pl-3 pr-10 py-2 border-b border-archive-border bg-transparent text-archive-text focus:outline-none focus:border-archive-accent transition-colors duration-300 font-mono text-sm appearance-none cursor-pointer hover:bg-archive-hover/30"
        >
          <option value="全部">全部標籤</option>
          {availableTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDownIcon className="h-4 w-4 text-archive-text/40 group-hover:text-archive-text group-hover:translate-y-0.5 transition-all duration-300" />
        </div>
      </div>
    </div>
  );
};

const DirectoryList = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div layout className="flex flex-col min-h-[400px]">
      {children}
    </motion.div>
  );
};

const DirectoryPagination = ({
  totalPages,
  totalItems,
  itemsPerPage,
}: DirectoryPaginationProps) => {
  const currentPage = useDirectoryStore((state) => state.filters.page);
  const setPage = useDirectoryStore((state) => state.setPage);
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i += 1) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 5; i += 1) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 4; i <= totalPages; i += 1) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i += 1) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 pb-4 border-t border-archive-border">
      <div className="text-sm font-mono text-archive-text/60">
        顯示第 <span className="text-archive-text">{startItem}</span> 至{" "}
        <span className="text-archive-text">{endItem}</span> 筆，共{" "}
        <span className="text-archive-text">{totalItems}</span> 位創作者
      </div>

      <div className="flex items-center gap-2 cursor-pointer">
        <button
          onClick={() => setPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="group p-2 rounded-sm border border-archive-border hover:border-archive-accent hover:bg-archive-hover/50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-archive-border disabled:hover:bg-transparent transition-all duration-300 cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeftIcon
            size={16}
            className="text-archive-text group-hover:text-archive-text group-hover:-translate-x-0.5 transition-all duration-300"
          />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-sm font-mono text-archive-text/40"
                >
                  ...
                </span>
              );
            }
            const pageNum = page as number;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`relative px-3 py-2 text-sm font-mono rounded-sm transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "text-archive-text bg-archive-accent/10"
                    : "text-archive-text/60 hover:text-archive-text hover:bg-archive-hover/50"
                }`}
              >
                {pageNum}
                {isActive ? (
                  <motion.div
                    layoutId="activePage"
                    className="absolute inset-0 border border-archive-accent rounded-sm"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="group p-2 rounded-sm border border-archive-border hover:border-archive-accent hover:bg-archive-hover/50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-archive-border disabled:hover:bg-transparent transition-all duration-300 cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRightIcon
            size={16}
            className="text-archive-text group-hover:text-archive-text group-hover:translate-x-0.5 transition-all duration-300"
          />
        </button>
      </div>
    </div>
  );
};

const DirectoryEmptyState = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="py-20 text-center flex flex-col items-center justify-center text-archive-text/40">
      <span className="font-sans text-lg mb-2">{title}</span>
      <span className="text-sm">{subtitle}</span>
    </div>
  );
};

export const Directory = {
  Root: DirectoryRoot,
  DayBar: DirectoryDayBar,
  DayTabs: DirectoryDayTabs,
  MiniPagination: DirectoryMiniPagination,
  FilterBar: DirectoryFilterBar,
  Search: DirectorySearch,
  SortSelect: DirectorySortSelect,
  TagSelect: DirectoryTagSelect,
  List: DirectoryList,
  Pagination: DirectoryPagination,
  EmptyState: DirectoryEmptyState,
};
