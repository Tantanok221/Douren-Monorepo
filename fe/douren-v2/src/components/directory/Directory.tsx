import { motion } from "framer-motion";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { StoreApi } from "zustand";
import { useStore } from "zustand";
import type { DirectoryFilters } from "@/types/models";
import { createDirectoryStore, type DirectoryState } from "./directoryStore";
import { ALL_TAGS_FILTER, parseTagFilter } from "./tagFilter";
import {
  Pagination as PaginationComponent,
  type PaginationParams,
} from "./pagination";

interface DirectoryRootProps {
  children: ReactNode;
  availableTags: string[];
  initialFilters?: Partial<DirectoryFilters>;
}

interface DirectoryPaginationProps {
  pagination: PaginationParams;
}

interface DirectoryMiniPaginationProps {
  pagination: PaginationParams;
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
  pagination,
}: DirectoryMiniPaginationProps) => {
  const setPage = useDirectoryStore((state) => state.setPage);

  return (
    <PaginationComponent
      pagination={pagination}
      onPageChange={setPage}
      variant="mini"
    />
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
  const tagFilter = useDirectoryStore((state) => state.filters.tag);
  const toggleTag = useDirectoryStore((state) => state.toggleTag);
  const clearTags = useDirectoryStore((state) => state.clearTags);
  const availableTags = useDirectoryStore((state) => state.availableTags);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const selectedTags = parseTagFilter(tagFilter);
  const selectedTagsSet = new Set(selectedTags);
  const filteredTags = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return availableTags;
    return availableTags.filter((tag) =>
      tag.toLowerCase().includes(normalizedSearch),
    );
  }, [availableTags, searchTerm]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (dropdownRef.current.contains(event.target as Node)) return;
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedLabel =
    selectedTags.length === 0
      ? "全部標籤"
      : `已選擇 ${selectedTags.length} 個標籤`;

  return (
    <div className="col-span-1 md:col-span-3 relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="mt-2 w-full flex items-center justify-between pl-3 pr-2 py-2 border-b border-archive-border bg-transparent text-archive-text hover:bg-archive-hover/30 focus:outline-none focus:border-archive-accent transition-colors duration-300 font-mono text-sm cursor-pointer"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDownIcon
          className={`h-4 w-4 text-archive-text/50 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div className="absolute z-20 mt-2 w-full rounded-md border border-archive-border bg-archive-bg shadow-xl p-2">
          <div className="relative mb-2">
            <SearchIcon className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-archive-text/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="搜尋標籤..."
              className="w-full pl-8 pr-2 py-2 text-xs font-mono border border-archive-border rounded-sm bg-transparent text-archive-text placeholder-archive-text/40 focus:outline-none focus:border-archive-accent"
            />
          </div>

          <div className="max-h-44 overflow-y-auto flex flex-col gap-1">
            <button
              type="button"
              onClick={clearTags}
              className={`w-full flex items-center justify-between px-2 py-1.5 text-xs font-mono rounded-sm border transition-colors cursor-pointer ${
                selectedTags.length === 0
                  ? "border-archive-accent/50 text-archive-accent bg-archive-accent/10"
                  : "border-archive-border text-archive-text/70 hover:text-archive-text hover:border-archive-text/40"
              }`}
            >
              <span>{ALL_TAGS_FILTER}</span>
              {selectedTags.length === 0 ? <CheckIcon size={14} /> : null}
            </button>

            {filteredTags.map((tag) => {
              const isSelected = selectedTagsSet.has(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 text-xs font-mono rounded-sm transition-colors cursor-pointer ${
                    isSelected
                      ? "border-archive-accent/50 text-archive-accent bg-archive-accent/10 border"
                      : "border border-transparent text-archive-text/70 hover:text-archive-text hover:border-archive-text/40"
                  }`}
                >
                  <span className="truncate">{tag}</span>
                  {isSelected ? <CheckIcon size={14} /> : null}
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-archive-border/70 flex items-center justify-between">
            <span className="text-[11px] font-sans text-archive-text/50">
              {selectedTags.length > 0
                ? `${selectedTags.length} 個已選擇`
                : "顯示所有標籤"}
            </span>
            <button
              type="button"
              onClick={clearTags}
              disabled={selectedTags.length === 0}
              className="text-[11px]! font-sans text-archive-text/60 hover:text-archive-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              清除
            </button>
          </div>
        </div>
      ) : null}

      {!isOpen && selectedTags.length > 0 ? (
        <p className="text-[11px] font-mono text-archive-text/50 mt-2">
          {selectedTags.join("、")}
        </p>
      ) : null}
      {!isOpen && availableTags.length === 0 ? (
        <p className="text-[11px] font-mono text-archive-text/40 mt-2">
          暫無可用標籤
        </p>
      ) : null}
      {isOpen && filteredTags.length === 0 ? (
        <p className="text-[11px] font-mono text-archive-text/40 mt-2">
          找不到符合的標籤
        </p>
      ) : null}
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

const DirectoryPagination = ({ pagination }: DirectoryPaginationProps) => {
  const setPage = useDirectoryStore((state) => state.setPage);

  return <PaginationComponent pagination={pagination} onPageChange={setPage} />;
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
