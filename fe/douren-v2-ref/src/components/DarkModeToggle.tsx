import React from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { motion } from 'framer-motion';
interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}
export function DarkModeToggle({ isDark, onToggle }: DarkModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="relative p-2 rounded-sm hover:bg-archive-hover/50 transition-all focus:outline-none focus:ring-2 focus:ring-archive-accent"
      aria-label={isDark ? '切換至淺色模式' : '切換至深色模式'}>

      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 0 : 1,
          opacity: isDark ? 0 : 1,
          rotate: isDark ? 90 : 0
        }}
        transition={{
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="absolute inset-0 flex items-center justify-center">

        <SunIcon size={16} className="text-archive-text/60" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 1 : 0,
          opacity: isDark ? 1 : 0,
          rotate: isDark ? 0 : -90
        }}
        transition={{
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="absolute inset-0 flex items-center justify-center">

        <MoonIcon size={16} className="text-archive-text/60" />
      </motion.div>
      {/* Invisible spacer to maintain button size */}
      <div className="w-4 h-4 opacity-0">
        <SunIcon size={16} />
      </div>
    </button>);

}