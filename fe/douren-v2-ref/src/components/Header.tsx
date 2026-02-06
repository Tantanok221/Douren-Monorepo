import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDownIcon } from 'lucide-react';
import { Event } from '../types';
import { DarkModeToggle } from './DarkModeToggle';
interface HeaderProps {
  events: Event[];
  selectedEvent: Event;
  onEventChange: (event: Event) => void;
  isDark: boolean;
  onDarkModeToggle: () => void;
}
export function Header({
  events,
  selectedEvent,
  onEventChange,
  isDark,
  onDarkModeToggle
}: HeaderProps) {
  const location = useLocation();
  const isBookmarks = location.pathname === '/bookmarks';
  return (
    <header className="w-full py-8 md:py-12 border-b border-archive-border mb-8">
      <div className="flex flex-col items-center gap-6 mb-8">
        {/* Logo */}
        <Link to="/" className="group">
          <motion.img
            src="/pasted-image.webp"
            alt="同人檔案館"
            className="w-20 h-20 object-contain"
            whileHover={{
              scale: 1.05,
              rotate: 2
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20
            }} />

        </Link>

        {/* Title and Description */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1
            className="text-3xl md:text-4xl font-medium tracking-tight text-archive-text"
            style={{
              fontFamily: "'Noto Serif TC', serif"
            }}>

            <Link to="/" className="hover:opacity-70 transition-opacity">
              同人檔案館
            </Link>
          </h1>
          <p
            className="text-sm text-archive-text/70 max-w-md leading-relaxed"
            style={{
              fontFamily: "'Noto Serif TC', serif"
            }}>

            動漫展會與同人活動的創作者名錄。瀏覽、搜尋並收藏您喜愛的創作者。
          </p>
          <span className="text-xs font-mono text-archive-text/40 mt-1">
            活動檔案 • {selectedEvent.code}
          </span>
        </div>

        {/* Event Selector */}
        <div className="relative group">
          <select
            value={selectedEvent.id}
            onChange={(e) => {
              const event = events.find((ev) => ev.id === e.target.value);
              if (event) onEventChange(event);
            }}
            className="appearance-none bg-transparent text-sm font-mono text-archive-text/60 hover:text-archive-text pr-8 py-1.5 cursor-pointer focus:outline-none transition-colors duration-300 border border-archive-border hover:border-archive-accent rounded-sm px-3">

            {events.map((event) =>
            <option key={event.id} value={event.id}>
                {event.name} ({event.code})
              </option>
            )}
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-archive-text/40 group-hover:text-archive-accent group-hover:translate-y-[calc(-50%+2px)] transition-all duration-300 pointer-events-none" />
        </div>
      </div>

      {/* Navigation and Dark Mode Toggle */}
      <div className="flex items-center justify-center gap-6">
        <nav className="flex gap-8">
          <Link
            to="/"
            className={`relative text-sm font-sans tracking-wider transition-colors duration-300 py-1 ${!isBookmarks ? 'text-archive-text' : 'text-archive-text/40 hover:text-archive-text/70'}`}>

            所有創作者
            {!isBookmarks &&
            <motion.div
              layoutId="nav-underline"
              className="absolute -bottom-1 left-0 right-0 h-px bg-archive-accent"
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30
              }} />

            }
          </Link>
          <Link
            to="/bookmarks"
            className={`relative text-sm font-sans tracking-wider transition-colors duration-300 py-1 ${isBookmarks ? 'text-archive-text' : 'text-archive-text/40 hover:text-archive-text/70'}`}>

            我的收藏
            {isBookmarks &&
            <motion.div
              layoutId="nav-underline"
              className="absolute -bottom-1 left-0 right-0 h-px bg-archive-accent"
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30
              }} />

            }
          </Link>
        </nav>

        <div className="h-4 w-px bg-archive-border" />

        <DarkModeToggle isDark={isDark} onToggle={onDarkModeToggle} />
      </div>
    </header>);

}