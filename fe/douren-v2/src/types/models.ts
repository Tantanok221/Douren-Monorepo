export interface ArtistViewModel {
  id: number;
  name: string;
  handle: string;
  boothLocations: {
    day1: string;
    day2: string;
    day3: string;
  };
  tags: string[];
  bio: string;
  imageUrl: string;
  workImages: string[];
  socials: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    pixiv?: string;
    plurk?: string;
    website?: string;
  };
}

export interface EventViewModel {
  id: number;
  name: string;
  code: string;
}

export interface DirectoryFilters {
  day: string;
  search: string;
  sort: string;
  tag: string;
  page: number;
}
