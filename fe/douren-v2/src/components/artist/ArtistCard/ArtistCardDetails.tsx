import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FallbackImage } from "@/components/common/FallbackImage";
import { trpc } from "@/helper/trpc";
import { ImageLightbox } from "../ImageLightbox";
import { useArtistCard } from "./ArtistCardContext";

export const ArtistCardDetails = () => {
  const { artist } = useArtistCard();
  const detailsQuery = trpc.artist.getArtistPageDetails.useQuery({
    id: artist.id.toString(),
  });
  const productImages =
    detailsQuery.data?.products
      ?.map((product) => product.preview ?? product.thumbnail ?? "")
      .filter((image) => image.length > 0) ?? [];
  const galleryImages =
    productImages.length > 0 ? productImages : artist.workImages;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleImageClick = (event: MouseEvent, index: number) => {
    event.stopPropagation();
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="md:col-span-7 border-l border-archive-border/70 md:pl-8 px-2 md:px-0">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono uppercase tracking-wider text-archive-text/45">
              作品
            </span>
            {detailsQuery.isPending ? (
              <div className="min-h-28 rounded-sm border border-dashed border-archive-border/80 bg-archive-hover/10 flex items-center justify-center">
                <span className="text-xs font-mono text-archive-text/55">
                  Loading artworks...
                </span>
              </div>
            ) : detailsQuery.isError ? (
              <div className="min-h-28 rounded-sm border border-dashed border-archive-border/80 bg-archive-hover/10 flex items-center justify-center">
                <span className="text-xs font-mono text-archive-text/55">
                  Unable to load artworks.
                </span>
              </div>
            ) : galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {galleryImages.map((image, index) => (
                  <motion.button
                    key={`${artist.id}-work-${index}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.03 }}
                    onClick={(event) => handleImageClick(event, index)}
                    className="relative aspect-square overflow-hidden rounded-sm bg-archive-border/30 cursor-pointer group/work"
                  >
                    <FallbackImage
                      src={image}
                      alt={`${artist.name} work ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/work:scale-105"
                    />
                    <div className="absolute inset-0 bg-archive-text/0 group-hover/work:bg-archive-text/10 transition-colors duration-200" />
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="min-h-28 rounded-sm border border-dashed border-archive-border/80 bg-archive-hover/10 flex items-center justify-center">
                <span className="text-xs font-mono text-archive-text/55">
                  目前尚無作品。
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

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
