import { motion } from "framer-motion";
import { ArrowLeftIcon, ExternalLinkIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { FallbackImage } from "@/components/common/FallbackImage";
import { renderSocialLinks } from "@/components/artist/ArtistCard/artistCardHelpers";
import type { ArtistViewModel } from "@/types/models";
import { ImageLightbox } from "@/components/artist/ImageLightbox";

const MOCK_ARTIST: ArtistViewModel = {
  id: 142,
  name: "星空畫坊",
  handle: "@hoshizora_atelier",
  boothLocations: {
    day1: "A-03",
    day2: "A-03",
    day3: "",
  },
  tags: ["原創", "奇幻", "角色設計", "插圖", "BL", "輕小說插畫"],
  bio: "以星空與宇宙為靈感，描繪充滿奇幻色彩的世界觀與角色故事。主要創作原創角色設計與插圖集，偶爾涉足輕小說插畫。喜歡畫各種氛圍的角色，從柔美到帥氣都有涉獵。每年參加 FF、CWT 等大型同人展，期待在展場與大家相遇！展攤上會販售新刊、明信片、壓克力立牌等各式周邊，歡迎大家來逛攤～",
  imageUrl:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop&q=80",
  workImages: [
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=600&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=600&h=600&fit=crop&q=80",
  ],
  socials: {
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    pixiv: "https://pixiv.net",
    website: "https://example.com",
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

interface ArtistPageProps {
  eventName: string;
}

export const ArtistPage: React.FC<ArtistPageProps> = ({ eventName }) => {
  const artist = MOCK_ARTIST;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  return (
    <div className="py-6">
      {/* Top bar: back nav + catalog ID */}
      <motion.div
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="show"
        className="flex items-center justify-between mb-10 md:mb-16"
      >
        <Link
          to="/events/$eventName"
          params={{ eventName }}
          className="inline-flex items-center gap-2 text-sm font-mono text-archive-text/45 hover:text-archive-text transition-colors duration-300 group"
        >
          <ArrowLeftIcon
            size={13}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          返回創作者列表
        </Link>
        <span className="text-[11px] font-mono text-archive-text/25 tracking-[0.15em] uppercase select-none">
          No.{String(artist.id).padStart(4, "0")}
        </span>
      </motion.div>

      {/* Hero: photo + identity */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 mb-14 md:mb-20">
        {/* Portrait */}
        <motion.div
          variants={fadeUp}
          custom={0.05}
          initial="hidden"
          animate="show"
          className="md:col-span-4 lg:col-span-3"
        >
          <div className="relative overflow-hidden bg-archive-border/30 aspect-square group">
            <FallbackImage
              src={artist.imageUrl}
              alt={artist.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-archive-text/0 group-hover:bg-archive-text/[0.04] transition-colors duration-500" />
          </div>
        </motion.div>

        {/* Identity block */}
        <motion.div
          variants={fadeUp}
          custom={0.12}
          initial="hidden"
          animate="show"
          className="md:col-span-8 lg:col-span-9 flex flex-col justify-center gap-6 md:gap-8"
        >
          <div>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-medium text-archive-text leading-[1.1] tracking-tight mb-3"
              style={{ fontFamily: "'Noto Serif TC', serif" }}
            >
              {artist.name}
            </h1>
            <p className="text-sm font-mono text-archive-text/45 tracking-wide">
              {artist.handle}
            </p>
          </div>

          {/* Socials inline in hero */}
          <div className="flex items-center gap-5 pt-2">
            {renderSocialLinks(artist.socials, {
              iconSize: 18,
              baseClassName:
                "text-archive-text/65 hover:text-archive-text transition-colors duration-300 cursor-pointer",
            })}
            {artist.socials.website && (
              <a
                href={artist.socials.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-archive-text/65 hover:text-archive-accent transition-colors duration-300 border border-archive-border hover:border-archive-accent px-3 py-1.5 ml-2"
              >
                官方網站
                <ExternalLinkIcon size={11} />
              </a>
            )}
          </div>
        </motion.div>
      </div>

      {/* Divider */}
      <motion.div
        variants={fadeUp}
        custom={0.18}
        initial="hidden"
        animate="show"
        className="border-t border-archive-border mb-10 md:mb-12"
      />

      {/* Tags */}
      <motion.div
        variants={fadeUp}
        custom={0.22}
        initial="hidden"
        animate="show"
        className="mb-10 md:mb-12"
      >
        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-archive-text/60 block mb-4">
          創作標籤
        </span>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-2"
        >
          {artist.tags.map((tag) => (
            <motion.span
              key={tag}
              variants={staggerItem}
              className="px-3 py-1.5 text-sm font-mono border border-archive-border text-archive-text/70 hover:border-archive-accent hover:text-archive-accent transition-all duration-300 cursor-default"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* Divider */}
      <motion.div
        variants={fadeUp}
        custom={0.28}
        initial="hidden"
        animate="show"
        className="border-t border-archive-border mb-10 md:mb-12"
      />

      {/* Bio */}
      <motion.div
        variants={fadeUp}
        custom={0.32}
        initial="hidden"
        animate="show"
        className="mb-10 md:mb-12 max-w-2xl"
      >
        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-archive-text/60 block mb-5">
          創作者簡介
        </span>
        <p
          className="text-base text-archive-text/80 leading-[1.9] border-l-2 border-archive-accent/40 pl-6"
          style={{ fontFamily: "'Noto Serif TC', serif" }}
        >
          {artist.bio}
        </p>
      </motion.div>

      {/* Divider */}
      <motion.div
        variants={fadeUp}
        custom={0.38}
        initial="hidden"
        animate="show"
        className="border-t border-archive-border mb-10 md:mb-12"
      />

      {/* Work gallery */}
      <motion.div
        variants={fadeUp}
        custom={0.42}
        initial="hidden"
        animate="show"
        className="mb-4"
      >
        <div className="flex items-baseline justify-between mb-6">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-archive-text/60">
            作品集
          </span>
          <span className="text-[11px] font-mono text-archive-text/50">
            {artist.workImages.length} 件作品
          </span>
        </div>

        {artist.workImages.length > 0 ? (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3"
          >
            {artist.workImages.map((img, i) => (
              <motion.button
                key={`work-${i}`}
                variants={staggerItem}
                onClick={() => {
                  setLightboxIndex(i);
                  setLightboxOpen(true);
                }}
                className="relative aspect-square overflow-hidden bg-archive-border/30 cursor-pointer group block"
              >
                <FallbackImage
                  src={img}
                  alt={`${artist.name} 作品 ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-archive-text/0 group-hover:bg-archive-text/[0.08] transition-colors duration-400" />
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] font-mono text-archive-bg/80 bg-archive-text/60 px-1.5 py-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <div className="py-16 border border-dashed border-archive-border flex items-center justify-center">
            <span className="text-sm font-mono text-archive-text/35">
              目前尚無作品
            </span>
          </div>
        )}
      </motion.div>

      {artist.workImages.length > 0 && (
        <ImageLightbox
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          imageUrl={artist.workImages[lightboxIndex]}
          images={artist.workImages}
          currentIndex={lightboxIndex}
          onNavigate={setLightboxIndex}
          artistName={artist.name}
        />
      )}
    </div>
  );
};
