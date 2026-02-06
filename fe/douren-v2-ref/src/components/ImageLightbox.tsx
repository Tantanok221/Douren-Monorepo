import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  images?: string[];
  currentIndex?: number;
  onNavigate?: (index: number) => void;
  artistName?: string;
}
export function ImageLightbox({
  isOpen,
  onClose,
  imageUrl,
  images,
  currentIndex,
  onNavigate,
  artistName
}: ImageLightboxProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (!images || !onNavigate || currentIndex === undefined) return;
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onNavigate(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
        onNavigate(currentIndex + 1);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleArrowKeys);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleArrowKeys);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, images, currentIndex, onNavigate]);
  const canNavigatePrev =
  images && onNavigate && currentIndex !== undefined && currentIndex > 0;
  const canNavigateNext =
  images &&
  onNavigate &&
  currentIndex !== undefined &&
  currentIndex < images.length - 1;
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          {/* Backdrop with subtle gradient */}
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          transition={{
            duration: 0.3
          }}
          className="fixed inset-0 bg-gradient-to-br from-archive-text/95 via-archive-text/97 to-archive-text/95 backdrop-blur-md z-50 cursor-pointer"
          onClick={onClose} />


          {/* Lightbox Content */}
          <div className="fixed inset-0 z-50 flex flex-col pointer-events-none">
            {/* Top Bar */}
            <motion.div
            initial={{
              y: -20,
              opacity: 0
            }}
            animate={{
              y: 0,
              opacity: 1
            }}
            exit={{
              y: -20,
              opacity: 0
            }}
            transition={{
              duration: 0.3,
              delay: 0.1
            }}
            className="flex items-center justify-between px-6 md:px-12 py-6 pointer-events-auto">

              <div className="flex flex-col gap-1">
                {artistName &&
              <h3
                className="text-lg md:text-xl font-sans font-medium text-archive-text"
                style={{
                  fontFamily: "'Noto Serif TC', serif"
                }}>

                    {artistName}
                  </h3>
              }
                {images && currentIndex !== undefined &&
              <p className="text-xs md:text-sm font-mono text-archive-text/70">
                    作品 {currentIndex + 1} / {images.length}
                  </p>
              }
              </div>

              <button
              onClick={onClose}
              className="group p-2.5 rounded-sm bg-archive-bg/10 hover:bg-archive-bg/20 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-archive-bg/50"
              aria-label="Close lightbox">

                <XIcon
                size={20}
                className="text-archive-bg group-hover:rotate-90 transition-transform duration-300" />

              </button>
            </motion.div>

            {/* Main Image Area */}
            <div className="flex-1 flex items-center justify-center px-4 md:px-20 pb-20 pointer-events-none">
              {/* Navigation - Left */}
              {canNavigatePrev &&
            <motion.button
              initial={{
                x: -20,
                opacity: 0
              }}
              animate={{
                x: 0,
                opacity: 1
              }}
              exit={{
                x: -20,
                opacity: 0
              }}
              transition={{
                duration: 0.3,
                delay: 0.15
              }}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate!(currentIndex! - 1);
              }}
              className="group pointer-events-auto mr-4 md:mr-8 p-3 md:p-4 rounded-sm bg-archive-bg hover:bg-archive-hover transition-all focus:outline-none focus:ring-2 focus:ring-archive-accent shadow-lg"
              aria-label="Previous image">

                  <ChevronLeftIcon
                size={24}
                className="text-archive-text group-hover:-translate-x-1 transition-transform"
                strokeWidth={2.5} />

                </motion.button>
            }

              {/* Image with Frame */}
              <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 20
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 20
              }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="relative pointer-events-auto"
              onClick={(e) => e.stopPropagation()}>

                {/* Image Frame */}
                <div className="relative bg-archive-bg p-3 md:p-6 rounded-sm shadow-2xl">
                  <img
                  src={imageUrl}
                  alt={artistName ? `${artistName} artwork` : 'Artwork'}
                  className="max-w-full max-h-[65vh] w-auto h-auto object-contain rounded-sm" />


                  {/* Subtle inner shadow for depth */}
                  <div className="absolute inset-3 md:inset-6 pointer-events-none rounded-sm shadow-inner" />
                </div>
              </motion.div>

              {/* Navigation - Right */}
              {canNavigateNext &&
            <motion.button
              initial={{
                x: 20,
                opacity: 0
              }}
              animate={{
                x: 0,
                opacity: 1
              }}
              exit={{
                x: 20,
                opacity: 0
              }}
              transition={{
                duration: 0.3,
                delay: 0.15
              }}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate!(currentIndex! + 1);
              }}
              className="group pointer-events-auto ml-4 md:ml-8 p-3 md:p-4 rounded-sm bg-archive-bg hover:bg-archive-hover transition-all focus:outline-none focus:ring-2 focus:ring-archive-accent shadow-lg"
              aria-label="Next image">

                  <ChevronRightIcon
                size={24}
                className="text-archive-text group-hover:translate-x-1 transition-transform"
                strokeWidth={2.5} />

                </motion.button>
            }
            </div>

            {/* Bottom Hint Bar - Elegant Style */}
            <motion.div
            initial={{
              y: 20,
              opacity: 0
            }}
            animate={{
              y: 0,
              opacity: 1
            }}
            exit={{
              y: 20,
              opacity: 0
            }}
            transition={{
              duration: 0.3,
              delay: 0.2
            }}
            className="flex items-center justify-center gap-6 px-6 pb-6 pointer-events-none">

              <div className="flex items-center gap-6 px-5 py-2.5 rounded-sm bg-archive-bg shadow-lg">
                <div className="flex items-center gap-2">
                  <kbd className="px-2.5 py-1 text-xs font-mono bg-archive-border/40 text-archive-text rounded border border-archive-border">
                    ←
                  </kbd>
                  <kbd className="px-2.5 py-1 text-xs font-mono bg-archive-border/40 text-archive-text rounded border border-archive-border">
                    →
                  </kbd>
                  <span className="text-xs font-mono text-archive-text/70 ml-0.5">
                    Navigate
                  </span>
                </div>
                <div className="w-px h-4 bg-archive-border" />
                <div className="flex items-center gap-2">
                  <kbd className="px-2.5 py-1 text-xs font-mono bg-archive-border/40 text-archive-text rounded border border-archive-border">
                    ESC
                  </kbd>
                  <span className="text-xs font-mono text-archive-text/70 ml-0.5">
                    Close
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}