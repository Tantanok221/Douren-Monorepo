import { BookmarkIcon, MinusIcon, PlusIcon } from "lucide-react";
import { useArtistCard } from "./ArtistCardContext";
import {
  getBoothLocationEntries,
  renderSocialLinks,
} from "./artistCardHelpers";

export const ArtistCardSummary = () => {
  const { artist, isOpen, toggle, bookmarks, onBookmarkToggle, selectedTags } =
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
      className="w-full py-5 flex items-start gap-4 text-left transition-colors duration-300 hover:bg-archive-hover/50 px-2 -mx-2 rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-archive-accent cursor-pointer"
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
            <span className="text-lg md:text-xl font-sans font-medium text-archive-text group-hover:text-archive-text/80 transition-colors duration-300 leading-tight">
              {artist.name}
            </span>
            <span className="text-sm font-mono text-archive-text/60 mt-1">
              {artist.handle}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div
              onClick={handleBookmark}
              className="text-archive-text/40 hover:text-archive-text transition-colors p-1 cursor-pointer"
            >
              <BookmarkIcon
                size={18}
                fill={bookmarks.has(artist.id) ? "currentColor" : "none"}
                className={
                  bookmarks.has(artist.id) ? "text-archive-accent" : ""
                }
              />
            </div>
            <span className="text-archive-text">
              {isOpen ? <MinusIcon size={18} /> : <PlusIcon size={18} />}
            </span>
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

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-archive-text/70">
          {getBoothLocationEntries(artist.boothLocations).map(
            ({ label, value }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="text-archive-text">{label}:</span>
                <span className="text-archive-text">{value || "—"}</span>
              </div>
            ),
          )}
        </div>

        <div className="flex items-center gap-3" onClick={handleSocialClick}>
          {renderSocialLinks(artist.socials, {
            iconSize: 18,
            baseClassName:
              "text-archive-text transition-colors cursor-pointer hover:text-archive-text",
          })}
        </div>
      </div>
    </button>
  );
};
