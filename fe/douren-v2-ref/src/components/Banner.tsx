import React from 'react';
import { motion } from 'framer-motion';
interface BannerProps {
  imageUrl: string;
  alt?: string;
  overlay?: {
    title?: string;
    subtitle?: string;
  };
}
export function Banner({
  imageUrl,
  alt = 'Event banner',
  overlay
}: BannerProps) {
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      transition={{
        duration: 0.6
      }}
      className="relative w-full aspect-[5/1] md:aspect-[6/1] overflow-hidden bg-archive-border/30 mb-8">

      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-cover grayscale-[30%]" />


      {/* Optional overlay content */}
      {overlay &&
      <div className="absolute inset-0 bg-gradient-to-t from-archive-text/60 via-archive-text/20 to-transparent flex items-end">
          <div className="w-full p-6 md:p-8">
            {overlay.title &&
          <h2
            className="text-2xl md:text-4xl font-medium text-archive-bg mb-2"
            style={{
              fontFamily: "'Noto Serif TC', serif"
            }}>

                {overlay.title}
              </h2>
          }
            {overlay.subtitle &&
          <p className="text-sm md:text-base text-archive-bg/90 font-sans">
                {overlay.subtitle}
              </p>
          }
          </div>
        </div>
      }
    </motion.div>);

}