import { motion } from "framer-motion";
import { ChevronDownIcon, MoonIcon, SunIcon } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { EventViewModel } from "@/types/models";

interface LayoutRootProps {
  children: ReactNode;
}

interface LayoutBannerProps {
  imageUrl: string;
  alt?: string;
  overlay?: {
    title?: string;
    subtitle?: string;
  };
}

interface LayoutHeaderProps {
  events: EventViewModel[];
  selectedEvent?: EventViewModel;
  onEventChange: (event: EventViewModel) => void;
  isDark: boolean;
  onDarkModeToggle: () => void;
}

interface LayoutFooterProps {
  eventCode?: string;
}

const LayoutRoot = ({ children }: LayoutRootProps) => {
  return (
    <div className="min-h-screen w-full bg-archive-bg text-archive-text px-4 md:px-8 lg:px-12 py-8">
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
};

const LayoutBanner = ({ imageUrl, alt, overlay }: LayoutBannerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full aspect-[5/1] md:aspect-[6/1] overflow-hidden bg-archive-border/30 mb-8"
    >
      <img
        src={imageUrl}
        alt={alt ?? "Event banner"}
        className="w-full h-full object-cover grayscale-[30%]"
      />

      {overlay ? (
        <div className="absolute inset-0 bg-gradient-to-t from-archive-text/60 via-archive-text/20 to-transparent flex items-end">
          <div className="w-full p-6 md:p-8">
            {overlay.title ? (
              <h2
                className="text-2xl md:text-4xl font-medium text-archive-bg mb-2"
                style={{ fontFamily: "'Noto Serif TC', serif" }}
              >
                {overlay.title}
              </h2>
            ) : null}
            {overlay.subtitle ? (
              <p className="text-sm md:text-base text-archive-bg/90 font-sans">
                {overlay.subtitle}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </motion.div>
  );
};

const DarkModeToggle = ({
  isDark,
  onToggle,
}: {
  isDark: boolean;
  onToggle: () => void;
}) => {
  return (
    <button
      onClick={onToggle}
      className="relative p-2 rounded-sm hover:bg-archive-hover/50 transition-all focus:outline-none focus:ring-2 focus:ring-archive-accent"
      aria-label={isDark ? "切換至淺色模式" : "切換至深色模式"}
    >
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 0 : 1,
          opacity: isDark ? 0 : 1,
          rotate: isDark ? 90 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <SunIcon size={16} className="text-archive-text/60" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 1 : 0,
          opacity: isDark ? 1 : 0,
          rotate: isDark ? 0 : -90,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <MoonIcon size={16} className="text-archive-text/60" />
      </motion.div>
      <div className="w-4 h-4 opacity-0">
        <SunIcon size={16} />
      </div>
    </button>
  );
};

const LayoutHeader = ({
  events,
  selectedEvent,
  onEventChange,
  isDark,
  onDarkModeToggle,
}: LayoutHeaderProps) => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isBookmarks = pathname.endsWith("/bookmarks");
  return (
    <header className="w-full py-8 md:py-12 border-b border-archive-border mb-8">
      <div className="flex flex-col items-center gap-6 mb-8">
        <Link to="/" className="group">
          <motion.img
            src="/pasted-image.webp"
            alt="同人檔案館"
            className="w-20 h-20 object-contain"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        </Link>

        <div className="flex flex-col items-center gap-2 text-center">
          <h1
            className="text-3xl md:text-4xl font-medium tracking-tight text-archive-text"
            style={{ fontFamily: "'Noto Serif TC', serif" }}
          >
            <Link to="/" className="hover:opacity-70 transition-opacity">
              同人檔案館
            </Link>
          </h1>
          <h2
            className="text-sm text-archive-text/70 max-w-md leading-relaxed"
            style={{ fontFamily: "'Noto Serif TC', serif" }}
          >
            動漫展會與同人活動的創作者名錄。瀏覽、搜尋並收藏您喜愛的創作者。
          </h2>
          {selectedEvent ? (
            <span className="text-xs font-mono text-archive-text/40 mt-1">
              活動檔案 • {selectedEvent.code}
            </span>
          ) : null}
        </div>

        <div className="relative group">
          <select
            value={selectedEvent ? String(selectedEvent.id) : ""}
            onChange={(event) => {
              const next = events.find((item) => item.id === Number(event.target.value));
              if (next) onEventChange(next);
            }}
            className="appearance-none bg-transparent text-sm font-mono text-archive-text/60 hover:text-archive-text pr-8 py-1.5 cursor-pointer focus:outline-none transition-colors duration-300 border border-archive-border hover:border-archive-accent rounded-sm px-3"
          >
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.code || event.name}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-archive-text/40 group-hover:text-archive-text group-hover:translate-y-[calc(-50%+2px)] transition-all duration-300 pointer-events-none" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-6">
        <nav className="flex gap-8">
          {selectedEvent ? (
            <Link
              to="/events/$eventName"
              params={{ eventName: selectedEvent.name }}
              className={`relative text-sm font-sans tracking-wider transition-colors duration-300 py-1 ${
                !isBookmarks
                  ? "text-archive-text"
                  : "text-archive-text/40 hover:text-archive-text/70"
              }`}
            >
              所有創作者
              {!isBookmarks ? (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-archive-text"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              ) : null}
            </Link>
          ) : (
            <span className="text-sm font-sans tracking-wider text-archive-text/40">
              所有創作者
            </span>
          )}
          {selectedEvent ? (
            <Link
              to="/events/$eventName/bookmarks"
              params={{ eventName: selectedEvent.name }}
              className={`relative text-sm font-sans tracking-wider transition-colors duration-300 py-1 ${
                isBookmarks
                  ? "text-archive-text"
                  : "text-archive-text/40 hover:text-archive-text/70"
              }`}
            >
              我的收藏
              {isBookmarks ? (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-archive-text"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              ) : null}
            </Link>
          ) : (
            <span className="text-sm font-sans tracking-wider text-archive-text/40">
              我的收藏
            </span>
          )}
        </nav>

        <div className="h-4 w-px bg-archive-border" />

        <DarkModeToggle isDark={isDark} onToggle={onDarkModeToggle} />
      </div>
    </header>
  );
};

const LayoutFooter = ({ eventCode }: LayoutFooterProps) => {
  return (
    <footer className="mt-20 py-8 border-t border-archive-border flex flex-col md:flex-row justify-between items-center text-xs font-sans text-archive-text/40 gap-4 md:gap-0">
      <div>
        © 2026 同人檔案館 • {eventCode ? `${eventCode} 活動` : "活動"}
      </div>
      <div className="flex gap-6">
        <a href="#" className="hover:text-archive-text transition-colors">
          關於
        </a>
        <a href="#" className="hover:text-archive-text transition-colors">
          條款
        </a>
        <a href="#" className="hover:text-archive-text transition-colors">
          隱私
        </a>
      </div>
    </footer>
  );
};

export const Layout = {
  Root: LayoutRoot,
  Banner: LayoutBanner,
  Header: LayoutHeader,
  Footer: LayoutFooter,
};
