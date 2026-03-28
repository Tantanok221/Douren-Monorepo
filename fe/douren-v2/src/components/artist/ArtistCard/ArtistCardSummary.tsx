import { BookmarkIcon } from "lucide-react";
import { FallbackImage } from "@/components/common/FallbackImage";
import { useArtistCard } from "./ArtistCardContext";
import {
  getBoothLocationEntries,
  renderSocialLinks,
} from "./artistCardHelpers";

export const ArtistCardSummary = () => {
  const { artist, bookmarks, onBookmarkToggle, selectedTags } = useArtistCard();

  const handleBookmark = () => {
    onBookmarkToggle(artist.id);
  };

  return (
    <div className="md:col-span-5 flex items-start gap-4 px-2 md:px-0">
      <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-sm overflow-hidden bg-archive-border/30">
        <FallbackImage
          src={artist.imageUrl}
          alt={artist.name}
          className="w-full h-full object-cover transition-all duration-500"
        />
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-sans font-medium text-archive-text group-hover:text-archive-text/80 transition-colors duration-300 leading-tight">
              {artist.name}
            </span>
            <span className="text-sm font-mono text-archive-text/60 mt-1">
              {artist.handle}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBookmark}
              className="text-archive-text/40 hover:text-archive-text transition-colors p-1 cursor-pointer"
              aria-label={`Bookmark ${artist.name}`}
            >
              <BookmarkIcon
                size={18}
                fill={bookmarks.has(artist.id) ? "currentColor" : "none"}
                className={
                  bookmarks.has(artist.id) ? "text-archive-accent" : ""
                }
              />
            </button>
          </div>
        </div>

        {artist.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {artist.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className={`px-2 py-0.5 text-[11px] font-mono rounded-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? "text-archive-accent border border-archive-accent/40"
                    : "bg-archive-border/40 text-archive-text/80"
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
        ) : null}

        <div className="flex items-center gap-3">
          {renderSocialLinks(artist.socials, {
            iconSize: 18,
            baseClassName:
              "text-archive-text transition-colors cursor-pointer hover:text-archive-text",
          })}
        </div>

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {getBoothLocationEntries(artist.boothLocations).map(
              ({ label, value }) => (
                <div
                  key={label}
                  className="px-3 py-2 rounded-sm border border-archive-border/70 bg-archive-hover/20"
                >
                  <span className="text-[11px] font-mono text-archive-text/55">
                    {label}
                  </span>
                  <p className="text-sm font-mono text-archive-text mt-1">
                    {value || "—"}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
