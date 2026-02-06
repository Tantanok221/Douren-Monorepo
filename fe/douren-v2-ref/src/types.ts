export interface Artist {
  id: string;
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
  workImages?: string[];
  socials: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    pixiv?: string;
    plurk?: string;
    website?: string;
  };
}

export interface Event {
  id: string;
  name: string;
  code: string;
  date: string;
}

export const MOCK_EVENTS: Event[] = [
{ id: '1', name: 'Fancy Frontier 45', code: 'FF45', date: 'Feb 2024' },
{ id: '2', name: 'Fancy Frontier 44', code: 'FF44', date: 'Aug 2023' },
{ id: '3', name: 'Comic World 65', code: 'CWT65', date: 'Dec 2023' }];