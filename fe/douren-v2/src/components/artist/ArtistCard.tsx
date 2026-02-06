import { AnimatePresence, motion } from "framer-motion";
import {
  BookmarkIcon,
  FacebookIcon,
  GlobeIcon,
  InstagramIcon,
  MinusIcon,
  PlusIcon,
  TwitterIcon,
} from "lucide-react";
import { createContext, useContext, useMemo, useState } from "react";
import type { ArtistViewModel } from "@/types/models";
import { ImageLightbox } from "./ImageLightbox";
import { trpc } from "@/helper/trpc";

interface ArtistCardRootProps {
  artist: ArtistViewModel;
  bookmarks: Set<number>;
  onBookmarkToggle: (id: number) => void;
  selectedTag?: string;
  children: React.ReactNode;
}

interface ArtistCardContextValue {
  artist: ArtistViewModel;
  isOpen: boolean;
  toggle: () => void;
  bookmarks: Set<number>;
  onBookmarkToggle: (id: number) => void;
  selectedTag?: string;
}

const ArtistCardContext = createContext<ArtistCardContextValue | null>(null);

const useArtistCard = () => {
  const context = useContext(ArtistCardContext);
  if (!context) {
    throw new Error("ArtistCard components must be used within ArtistCard.Root");
  }
  return context;
};

const ArtistCardRoot = ({
  artist,
  bookmarks,
  onBookmarkToggle,
  selectedTag,
  children,
}: ArtistCardRootProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const value = useMemo(
    () => ({
      artist,
      isOpen,
      toggle: () => setIsOpen((prev) => !prev),
      bookmarks,
      onBookmarkToggle,
      selectedTag,
    }),
    [artist, isOpen, bookmarks, onBookmarkToggle, selectedTag],
  );

  return (
    <ArtistCardContext.Provider value={value}>
      <div className="border-b border-archive-border group relative">
        {children}
      </div>
    </ArtistCardContext.Provider>
  );
};

const ArtistCardSummary = () => {
  const { artist, isOpen, toggle, bookmarks, onBookmarkToggle, selectedTag } =
    useArtistCard();
  const handleBookmark = (event: React.MouseEvent) => {
    event.stopPropagation();
    onBookmarkToggle(artist.id);
  };
  const handleSocialClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <button
      onClick={toggle}
      className="w-full py-5 flex items-start gap-4 text-left transition-colors duration-300 hover:bg-archive-hover/50 px-2 -mx-2 rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-archive-accent"
    >
      <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-sm overflow-hidden bg-archive-border/30">
        <img
          src={artist.imageUrl}
          alt={artist.name}
          className="w-full h-full object-cover transition-all duration-500"
        />
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-sans font-medium text-archive-text group-hover:text-archive-accent transition-colors duration-300 leading-tight">
              {artist.name}
            </span>
            <span className="text-sm font-mono text-archive-text/60 mt-1">
              {artist.handle}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div
              onClick={handleBookmark}
              className="text-archive-text/40 hover:text-archive-accent transition-colors p-1"
            >
              <BookmarkIcon
                size={18}
                fill={bookmarks.has(artist.id) ? "currentColor" : "none"}
                className={
                  bookmarks.has(artist.id) ? "text-archive-accent" : ""
                }
              />
            </div>
            <span className="text-archive-accent">
              {isOpen ? <MinusIcon size={18} /> : <PlusIcon size={18} />}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {artist.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className={`px-2 py-0.5 text-[11px] font-mono rounded-sm transition-colors ${
                selectedTag === tag
                  ? "bg-archive-accent/20 text-archive-accent border border-archive-accent/40"
                  : "bg-archive-border/40 text-archive-text/60"
              }`}
            >
              {tag}
            </span>
          ))}
          {artist.tags.length > 4 ? (
            <span className="px-2 py-0.5 text-[11px] font-mono text-archive-text/40">
              +{artist.tags.length - 4}
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-archive-text/70">
          <div className="flex items-center gap-1.5">
            <span className="text-archive-text/40">Day 1:</span>
            <span className="text-archive-text">
              {artist.boothLocations.day1 || "—"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-archive-text/40">Day 2:</span>
            <span className="text-archive-text">
              {artist.boothLocations.day2 || "—"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-archive-text/40">Day 3:</span>
            <span className="text-archive-text">
              {artist.boothLocations.day3 || "—"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3" onClick={handleSocialClick}>
          {artist.socials.twitter ? (
            <a
              href={artist.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-archive-text/40 hover:text-[#1DA1F2] transition-colors"
              aria-label="Twitter"
            >
              <TwitterIcon size={18} />
            </a>
          ) : null}
          {artist.socials.instagram ? (
            <a
              href={artist.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-archive-text/40 hover:text-[#E1306C] transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon size={18} />
            </a>
          ) : null}
          {artist.socials.facebook ? (
            <a
              href={artist.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-archive-text/40 hover:text-[#1877F2] transition-colors"
              aria-label="Facebook"
            >
              <FacebookIcon size={18} />
            </a>
          ) : null}
          {artist.socials.website ? (
            <a
              href={artist.socials.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-archive-text/40 hover:text-archive-accent transition-colors"
              aria-label="Website"
            >
              <GlobeIcon size={18} />
            </a>
          ) : null}
          {artist.socials.pixiv ? (
            <a
              href={artist.socials.pixiv}
              target="_blank"
              rel="noopener noreferrer"
              className="text-archive-text/40 hover:text-archive-accent transition-colors text-xs font-mono"
              aria-label="Pixiv"
            >
              PX
            </a>
          ) : null}
          {artist.socials.plurk ? (
            <a
              href={artist.socials.plurk}
              target="_blank"
              rel="noopener noreferrer"
              className="text-archive-text/40 hover:text-archive-accent transition-colors text-xs font-mono"
              aria-label="Plurk"
            >
              PL
            </a>
          ) : null}
        </div>
      </div>
    </button>
  );
};

const ArtistCardDetails = () => {
  const { artist, isOpen, selectedTag } = useArtistCard();
  const detailsQuery = trpc.artist.getArtistPageDetails.useQuery(
    { id: artist.id.toString() },
    { enabled: isOpen },
  );
  const productImages =
    detailsQuery.data?.products
      ?.map((product) => product.preview ?? product.thumbnail ?? "")
      .filter((image) => image.length > 0) ?? [];
  const galleryImages = productImages.length > 0 ? productImages : artist.workImages;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleImageClick = (event: React.MouseEvent, index: number) => {
    event.stopPropagation();
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleSocialClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-8 pt-2 md:pt-4 px-2">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                <div className="md:col-span-4 relative aspect-[4/3] md:aspect-[3/4] overflow-hidden bg-archive-border/30 rounded-sm">
                  <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="md:col-span-8 flex flex-col gap-8">
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="flex flex-wrap gap-2"
                  >
                    {artist.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-1 text-xs font-mono rounded-sm transition-colors ${
                          selectedTag === tag
                            ? "bg-archive-accent/20 text-archive-accent border border-archive-accent/40"
                            : "bg-archive-border/30 text-archive-text/70"
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </motion.div>

                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="text-base md:text-lg leading-relaxed text-archive-text/80 font-sans"
                  >
                    {artist.bio}
                  </motion.p>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                    className="flex flex-col gap-3"
                  >
                    <span className="text-xs font-mono uppercase tracking-wider text-archive-text/40">
                      Connect
                    </span>
                    <div className="flex gap-4" onClick={handleSocialClick}>
                      {artist.socials.twitter ? (
                        <a
                          href={artist.socials.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-archive-text/60 hover:text-[#1DA1F2] transition-colors"
                        >
                          <TwitterIcon size={24} />
                        </a>
                      ) : null}
                      {artist.socials.instagram ? (
                        <a
                          href={artist.socials.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-archive-text/60 hover:text-[#E1306C] transition-colors"
                        >
                          <InstagramIcon size={24} />
                        </a>
                      ) : null}
                      {artist.socials.facebook ? (
                        <a
                          href={artist.socials.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-archive-text/60 hover:text-[#1877F2] transition-colors"
                        >
                          <FacebookIcon size={24} />
                        </a>
                      ) : null}
                      {artist.socials.website ? (
                        <a
                          href={artist.socials.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-archive-text/60 hover:text-archive-accent transition-colors"
                        >
                          <GlobeIcon size={24} />
                        </a>
                      ) : null}
                      {artist.socials.pixiv ? (
                        <a
                          href={artist.socials.pixiv}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-archive-text/60 hover:text-archive-accent transition-colors text-sm font-mono flex items-center"
                        >
                          Pixiv
                        </a>
                      ) : null}
                      {artist.socials.plurk ? (
                        <a
                          href={artist.socials.plurk}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-archive-text/60 hover:text-archive-accent transition-colors text-sm font-mono flex items-center"
                        >
                          Plurk
                        </a>
                      ) : null}
                    </div>
                  </motion.div>

                  {galleryImages.length > 0 ? (
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="flex flex-col gap-4"
                    >
                      <span className="text-xs font-mono uppercase tracking-wider text-archive-text/40">
                        Works
                      </span>
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        {galleryImages.map((image, index) => (
                          <motion.button
                            key={`${artist.id}-work-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.35 + index * 0.05 }}
                            onClick={(event) => handleImageClick(event, index)}
                            className="relative aspect-square overflow-hidden rounded-sm bg-archive-border/30 group/work cursor-pointer"
                          >
                            <img
                              src={image}
                              alt={`${artist.name} work ${index + 1}`}
                              className="w-full h-full object-cover transition-all duration-500 group-hover/work:scale-105"
                            />
                            <div className="absolute inset-0 bg-archive-text/0 group-hover/work:bg-archive-text/10 transition-colors duration-300" />
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

                  {galleryImages.length > 0 ? (
                    <ImageLightbox
                      isOpen={lightboxOpen}
                      onClose={() => setLightboxOpen(false)}
                      imageUrl={galleryImages[lightboxIndex]}
                      images={galleryImages}
                      currentIndex={lightboxIndex}
                      onNavigate={setLightboxIndex}
                      artistName={artist.name}
                    />
                  ) : null}
    </>
  );
};

export const ArtistCard = {
  Root: ArtistCardRoot,
  Summary: ArtistCardSummary,
  Details: ArtistCardDetails,
};
