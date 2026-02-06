import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, ExternalLinkIcon } from 'lucide-react';
interface ArtistWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  artistName: string;
  artistHandle: string;
  workImages: string[];
  socials?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    pixiv?: string;
    plurk?: string;
    website?: string;
  };
}
export function ArtistWorkModal({
  isOpen,
  onClose,
  artistName,
  artistHandle,
  workImages,
  socials
}: ArtistWorkModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          {/* Backdrop */}
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
            duration: 0.2
          }}
          className="fixed inset-0 bg-archive-text/80 backdrop-blur-sm z-50"
          onClick={onClose} />


          {/* Modal */}
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
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="fixed inset-4 md:inset-8 lg:inset-16 bg-archive-bg rounded-sm shadow-2xl z-50 flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="flex items-start justify-between p-6 md:p-8 border-b border-archive-border">
              <div className="flex flex-col">
                <h2 className="text-2xl md:text-3xl font-sans font-medium text-archive-text">
                  {artistName}
                </h2>
                <span className="text-sm font-mono text-archive-text/60 mt-1">
                  {artistHandle}
                </span>
              </div>
              <button
              onClick={onClose}
              className="p-2 rounded-sm hover:bg-archive-hover/50 transition-colors focus:outline-none focus:ring-2 focus:ring-archive-accent"
              aria-label="Close modal">

                <XIcon size={24} className="text-archive-text/60" />
              </button>
            </div>

            {/* Gallery Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {workImages.map((image, index) =>
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05
                }}
                className="relative aspect-square overflow-hidden rounded-sm bg-archive-border/30 group">

                    <img
                  src={image}
                  alt={`${artistName} work ${index + 1}`}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />

                  </motion.div>
              )}
              </div>

              {/* Social Links */}
              {socials && Object.keys(socials).length > 0 &&
            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.4,
                delay: 0.3
              }}
              className="mt-8 pt-8 border-t border-archive-border">

                  <h3 className="text-xs font-mono uppercase tracking-wider text-archive-text/40 mb-4">
                    View More Work
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {socials.website &&
                <a
                  href={socials.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-archive-border rounded-sm hover:border-archive-accent hover:bg-archive-hover/50 transition-all text-sm font-mono">

                        <ExternalLinkIcon size={14} />
                        Website
                      </a>
                }
                    {socials.twitter &&
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-archive-border rounded-sm hover:border-archive-accent hover:bg-archive-hover/50 transition-all text-sm font-mono">

                        Twitter
                      </a>
                }
                    {socials.instagram &&
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-archive-border rounded-sm hover:border-archive-accent hover:bg-archive-hover/50 transition-all text-sm font-mono">

                        Instagram
                      </a>
                }
                    {socials.pixiv &&
                <a
                  href={socials.pixiv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-archive-border rounded-sm hover:border-archive-accent hover:bg-archive-hover/50 transition-all text-sm font-mono">

                        Pixiv
                      </a>
                }
                  </div>
                </motion.div>
            }
            </div>
          </motion.div>
        </>
      }
    </AnimatePresence>);

}