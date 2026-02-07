import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { trpc } from "@/helper/trpc";
import { ImageLightbox } from "../ImageLightbox";
import { useArtistCard } from "./ArtistCardContext";
import { renderSocialLinks } from "./artistCardHelpers";

export const ArtistCardDetails = () => {
  const { artist, isOpen, selectedTag } = useArtistCard();
  const detailsQuery = trpc.artist.getArtistPageDetails.useQuery(
    { id: artist.id.toString() },
    { enabled: isOpen },
  );
  const productImages =
    detailsQuery.data?.products
      ?.map((product) => product.preview ?? product.thumbnail ?? "")
      .filter((image) => image.length > 0) ?? [];
  const galleryImages =
    productImages.length > 0 ? productImages : artist.workImages;
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
                      {renderSocialLinks(artist.socials, {
                        iconSize: 24,
                        baseClassName:
                          "text-archive-text/60 transition-colors cursor-pointer hover:text-archive-text",
                      })}
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
                            transition={{
                              duration: 0.4,
                              delay: 0.35 + index * 0.05,
                            }}
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
