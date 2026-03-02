import type { eventArtistBaseSchemaType } from "@pkg/type";
import type { ArtistViewModel, EventViewModel } from "@/types/models";

const FALLBACK_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <rect width="800" height="600" fill="#e5e5e0" />
    <rect x="40" y="40" width="720" height="520" fill="#f2f2f0" stroke="#d6d6cf" />
    <text x="50%" y="50%" text-anchor="middle" font-family="Inter, sans-serif" font-size="20" fill="#a3a39c">
      No Image
    </text>
  </svg>`,
)}`;

const normalizeText = (value?: string | null) => value?.trim() ?? "";

const toEventCode = (name: string) => {
  const letters = name.match(/[A-Z]/g)?.join("") ?? "";
  const digits = name.match(/\d+/g)?.join("") ?? "";
  const code = `${letters}${digits}`.trim();
  return code.length > 0 ? code : name;
};

export const toEventViewModel = (event: {
  id: number;
  name: string;
}): EventViewModel => ({
  id: event.id,
  name: event.name,
  code: toEventCode(event.name),
});

export const toArtistViewModel = (
  artist: eventArtistBaseSchemaType,
): ArtistViewModel => {
  const boothName = normalizeText(artist.boothName);
  const author = normalizeText(artist.author);
  const tags = artist.tags
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((tag) => tag.tag)
    .filter(Boolean);

  return {
    id: artist.uuid,
    name: author || boothName || "Unknown Artist",
    handle: boothName || author || "—",
    boothLocations: {
      day1: normalizeText(artist.locationDay01),
      day2: normalizeText(artist.locationDay02),
      day3: normalizeText(artist.locationDay03),
    },
    tags,
    bio: normalizeText(artist.introduction) || "No introduction available.",
    imageUrl: normalizeText(artist.photo) || FALLBACK_IMAGE,
    workImages: [],
    socials: {
      twitter: normalizeText(artist.twitterLink) || undefined,
      instagram: normalizeText(artist.instagramLink) || undefined,
      facebook: normalizeText(artist.facebookLink) || undefined,
      pixiv: normalizeText(artist.pixivLink) || undefined,
      plurk: normalizeText(artist.plurkLink) || undefined,
      website:
        normalizeText(artist.officialLink) ||
        normalizeText(artist.storeLink) ||
        normalizeText(artist.myacgLink) ||
        undefined,
    },
  };
};

export const addWorkImages = (
  artist: ArtistViewModel,
  images: string[],
): ArtistViewModel => ({
  ...artist,
  workImages: images,
});

export const dedupeArtistsById = (
  artists: ArtistViewModel[],
): ArtistViewModel[] => {
  const seen = new Set<number>();
  return artists.filter((artist) => {
    if (seen.has(artist.id)) return false;
    seen.add(artist.id);
    return true;
  });
};
