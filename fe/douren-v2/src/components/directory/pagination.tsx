import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export interface PaginationParams {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  disabled?: boolean;
}

interface PaginationInput {
  currentPage: number;
  totalPage?: number | null;
  totalCount?: number | null;
  pageSize?: number | null;
  disabled?: boolean;
}

interface PaginationProps {
  pagination: PaginationParams;
  onPageChange: (page: number) => void;
  variant?: "default" | "mini";
}

type PaginationToken = number | "...";

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const toSafeInt = (
  value: number | null | undefined,
  fallback: number,
): number => {
  if (value == null || Number.isNaN(value)) {
    return fallback;
  }

  return Math.floor(value);
};

export const toPaginationParams = ({
  currentPage,
  totalPage,
  totalCount,
  pageSize,
  disabled = false,
}: PaginationInput): PaginationParams => {
  const safeTotalPages = Math.max(1, toSafeInt(totalPage, 1));
  const safeCurrentPage = clamp(toSafeInt(currentPage, 1), 1, safeTotalPages);

  return {
    currentPage: safeCurrentPage,
    totalPages: safeTotalPages,
    totalItems: Math.max(0, toSafeInt(totalCount, 0)),
    itemsPerPage: Math.max(1, toSafeInt(pageSize, 1)),
    disabled,
  };
};

export const getPaginationPageNumbers = (
  currentPage: number,
  totalPages: number,
): PaginationToken[] => {
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = clamp(currentPage, 1, safeTotalPages);

  const pages: PaginationToken[] = [];
  const maxVisible = 7;

  if (safeTotalPages <= maxVisible) {
    for (let page = 1; page <= safeTotalPages; page += 1) {
      pages.push(page);
    }
    return pages;
  }

  if (safeCurrentPage <= 3) {
    for (let page = 1; page <= 5; page += 1) {
      pages.push(page);
    }
    pages.push("...");
    pages.push(safeTotalPages);
    return pages;
  }

  if (safeCurrentPage >= safeTotalPages - 2) {
    pages.push(1);
    pages.push("...");
    for (let page = safeTotalPages - 4; page <= safeTotalPages; page += 1) {
      pages.push(page);
    }
    return pages;
  }

  pages.push(1);
  pages.push("...");
  for (let page = safeCurrentPage - 1; page <= safeCurrentPage + 1; page += 1) {
    pages.push(page);
  }
  pages.push("...");
  pages.push(safeTotalPages);

  return pages;
};

const PaginationMini = ({
  pagination,
  onPageChange,
}: Omit<PaginationProps, "variant">) => {
  const safeTotalPages = Math.max(1, pagination.totalPages);
  const safeCurrentPage = clamp(pagination.currentPage, 1, safeTotalPages);
  const isPrevDisabled = Boolean(pagination.disabled) || safeCurrentPage <= 1;
  const isNextDisabled =
    Boolean(pagination.disabled) || safeCurrentPage >= safeTotalPages;

  return (
    <div className="pb-4 flex items-center gap-2 md:gap-3 font-mono cursor-pointer">
      <button
        type="button"
        onClick={() => onPageChange(safeCurrentPage - 1)}
        disabled={isPrevDisabled}
        className="group p-1.5 text-archive-text/45 hover:text-archive-text disabled:text-archive-text/20 disabled:cursor-not-allowed transition-colors duration-300 cursor-pointer"
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      <span className="text-xs tracking-[0.15em] text-archive-text font-sans">
        {safeCurrentPage} / {safeTotalPages}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(safeCurrentPage + 1)}
        disabled={isNextDisabled}
        className="group p-1.5 text-archive-text/45 hover:text-archive-text disabled:text-archive-text/20 disabled:cursor-not-allowed transition-colors duration-300 cursor-pointer"
        aria-label="Next page"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

const PaginationDefault = ({
  pagination,
  onPageChange,
}: Omit<PaginationProps, "variant">) => {
  const safeTotalPages = Math.max(1, pagination.totalPages);
  const safeCurrentPage = clamp(pagination.currentPage, 1, safeTotalPages);
  const safeItemsPerPage = Math.max(1, pagination.itemsPerPage);
  const isPrevDisabled = Boolean(pagination.disabled) || safeCurrentPage <= 1;
  const isNextDisabled =
    Boolean(pagination.disabled) || safeCurrentPage >= safeTotalPages;

  if (safeTotalPages <= 1) {
    return null;
  }

  const startItem =
    pagination.totalItems === 0
      ? 0
      : (safeCurrentPage - 1) * safeItemsPerPage + 1;
  const endItem =
    pagination.totalItems === 0
      ? 0
      : Math.min(safeCurrentPage * safeItemsPerPage, pagination.totalItems);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 pb-4 border-t border-archive-border">
      <div className="text-sm font-mono text-archive-text/60">
        顯示第 <span className="text-archive-text">{startItem}</span> 至{" "}
        <span className="text-archive-text">{endItem}</span> 筆，共{" "}
        <span className="text-archive-text">{pagination.totalItems}</span>{" "}
        位創作者
      </div>

      <div className="flex items-center gap-2 cursor-pointer">
        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={isPrevDisabled}
          className="group p-2 rounded-sm border border-archive-border hover:border-archive-accent hover:bg-archive-hover/50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-archive-border disabled:hover:bg-transparent transition-all duration-300 cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeftIcon
            size={16}
            className="text-archive-text group-hover:text-archive-text group-hover:-translate-x-0.5 transition-all duration-300"
          />
        </button>

        <div className="flex items-center gap-1">
          {getPaginationPageNumbers(safeCurrentPage, safeTotalPages).map(
            (page, index) => {
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

              const isActive = page === safeCurrentPage;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange(page)}
                  className={`relative px-3 py-2 text-sm font-mono rounded-sm transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "text-archive-text bg-archive-accent/10"
                      : "text-archive-text/60 hover:text-archive-text hover:bg-archive-hover/50"
                  }`}
                >
                  {page}
                  {isActive ? (
                    <motion.div
                      layoutId="activePage"
                      className="absolute inset-0 border border-archive-accent rounded-sm"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  ) : null}
                </button>
              );
            },
          )}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={isNextDisabled}
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

export const Pagination = ({
  pagination,
  onPageChange,
  variant = "default",
}: PaginationProps) => {
  const safeTotalPages = Math.max(1, pagination.totalPages);

  const setPage = (nextPage: number) => {
    if (pagination.disabled) {
      return;
    }

    onPageChange(clamp(nextPage, 1, safeTotalPages));
  };

  if (variant === "mini") {
    return <PaginationMini pagination={pagination} onPageChange={setPage} />;
  }

  return <PaginationDefault pagination={pagination} onPageChange={setPage} />;
};
