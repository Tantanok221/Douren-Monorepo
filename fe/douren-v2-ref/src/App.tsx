import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ArtistDirectory } from './components/ArtistDirectory';
import { BookmarksPage } from './pages/BookmarksPage';
import { Layout } from './components/Layout';
import { useDarkMode } from './hooks/useDarkMode';
import { Artist, Event, MOCK_EVENTS } from './types';
// Mock Data moved here to be shared
const MOCK_ARTISTS: Artist[] = [
{
  id: '1',
  name: '#あゆのちゃーじ！',
  handle: '#AyunoCharge!',
  boothLocations: {
    day1: '',
    day2: 'R03',
    day3: ''
  },
  tags: ['Illustration', 'Original', 'Cute'],
  bio: 'Creating original character illustrations with a focus on vibrant colors and cute aesthetics. Available for commissions and collaborative projects.',
  imageUrl:
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=2000&auto=format&fit=crop',
  workImages: [
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop'],

  socials: {
    twitter: 'https://twitter.com',
    website: 'https://example.com'
  }
},
{
  id: '2',
  name: '*漂流天國*',
  handle: '*Drifting Heaven*',
  boothLocations: {
    day1: 'T07,T08',
    day2: 'T08',
    day3: ''
  },
  tags: ['Cosplay', 'PhotoBook', 'Fantasy'],
  bio: 'Professional cosplay group specializing in fantasy and sci-fi themes. We produce high-quality photobooks and prints from our latest shoots.',
  imageUrl:
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop',
  workImages: [
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop'],

  socials: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com'
  }
},
{
  id: '3',
  name: '+Ely Cosplay+',
  handle: '+Ely Cosplay+',
  boothLocations: {
    day1: '',
    day2: 'R43,R44',
    day3: 'R43,R44'
  },
  tags: ['Cosplay', 'Merch', 'Celebrity'],
  bio: 'International cosplayer Ely bringing characters to life. Visit our booth for exclusive signed prints, photobooks, and limited edition merchandise.',
  imageUrl:
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2000&auto=format&fit=crop',
  workImages: [
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=800&auto=format&fit=crop'],

  socials: {
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com'
  }
},
{
  id: '4',
  name: '+Poke 箱+',
  handle: '+Poke Box+',
  boothLocations: {
    day1: '',
    day2: 'D44',
    day3: 'D43,D44'
  },
  tags: ['Fan Art', 'Pokemon', 'Illustration'],
  bio: 'Dedicated to Pokemon fan art and illustrations. We have a wide range of stickers, keychains, and art prints featuring your favorite pocket monsters.',
  imageUrl:
  'https://images.unsplash.com/photo-1617364852223-75f57e78dc96?q=80&w=2000&auto=format&fit=crop',
  workImages: [
  'https://images.unsplash.com/photo-1617364852223-75f57e78dc96?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'],

  socials: {
    facebook: 'https://facebook.com',
    pixiv: 'https://pixiv.net',
    plurk: 'https://plurk.com'
  }
},
{
  id: '5',
  name: '+浣熊騎馬鈴薯+',
  handle: '+Raccoon Riding Potato+',
  boothLocations: {
    day1: 'A12',
    day2: '',
    day3: ''
  },
  tags: ['Comics', 'Humor', 'Original'],
  bio: 'A quirky comic circle featuring the daily adventures of a raccoon and a potato. Light-hearted humor and relatable slice-of-life stories.',
  imageUrl:
  'https://images.unsplash.com/photo-1554048612-387768052bf7?q=80&w=2000&auto=format&fit=crop',
  workImages: [
  'https://images.unsplash.com/photo-1554048612-387768052bf7?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=800&auto=format&fit=crop'],

  socials: {
    twitter: 'https://twitter.com',
    plurk: 'https://plurk.com'
  }
},
{
  id: '6',
  name: '-Sakimiya-',
  handle: '-Sakimiya-',
  boothLocations: {
    day1: 'B22',
    day2: 'B22',
    day3: ''
  },
  tags: ['Illustration', 'Dark Fantasy', 'Original'],
  bio: 'Exploring dark fantasy themes through detailed digital illustrations. Our art book "Nightfall" will be available for the first time at this event.',
  imageUrl:
  'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2000&auto=format&fit=crop',
  workImages: [
  'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519681393798-38e36fefce15?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop'],

  socials: {
    twitter: 'https://twitter.com',
    pixiv: 'https://pixiv.net'
  }
},
{
  id: '7',
  name: '000',
  handle: 'Triple Zero',
  boothLocations: {
    day1: 'C05',
    day2: 'C05',
    day3: 'C05'
  },
  tags: ['Music', 'CD', 'Electronic'],
  bio: 'Independent electronic music circle. Selling our latest album "Null Point" along with previous releases. Come listen to our demo tracks!',
  imageUrl:
  'https://images.unsplash.com/photo-1519681393798-38e36fefce15?q=80&w=2000&auto=format&fit=crop',
  workImages: [
  'https://images.unsplash.com/photo-1519681393798-38e36fefce15?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop'],

  socials: {
    website: 'https://soundcloud.com',
    twitter: 'https://twitter.com'
  }
},
{
  id: '8',
  name: '11:11',
  handle: 'Eleven Eleven',
  boothLocations: {
    day1: '',
    day2: 'F18',
    day3: ''
  },
  tags: ['Accessories', 'Handmade', 'Jewelry'],
  bio: 'Handcrafted jewelry and accessories inspired by celestial bodies. Each piece is unique and made with high-quality materials.',
  imageUrl:
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2000&auto=format&fit=crop',
  workImages: [
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1617364852223-75f57e78dc96?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=800&auto=format&fit=crop'],

  socials: {
    instagram: 'https://instagram.com'
  }
},
{
  id: '9',
  name: 'Stellar Dreams',
  handle: '@stellardreams',
  boothLocations: {
    day1: 'E15',
    day2: 'E15',
    day3: 'E15'
  },
  tags: ['Illustration', 'Space', 'Original'],
  bio: 'Cosmic-themed illustrations and prints. Specializing in space landscapes, nebulae, and celestial bodies with a dreamy, ethereal aesthetic.',
  imageUrl:
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2000&auto=format&fit=crop',
  workImages: [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519681393798-38e36fefce15?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop'],

  socials: {
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com'
  }
},
{
  id: '10',
  name: 'Pixel Paradise',
  handle: '@pixelparadise',
  boothLocations: {
    day1: 'G20',
    day2: '',
    day3: 'G20'
  },
  tags: ['Pixel Art', 'Games', 'Retro'],
  bio: 'Retro pixel art inspired by classic 8-bit and 16-bit games. Creating nostalgic artwork, stickers, and enamel pins for gaming enthusiasts.',
  imageUrl:
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2000&auto=format&fit=crop',
  workImages: [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=800&auto=format&fit=crop'],

  socials: {
    twitter: 'https://twitter.com',
    website: 'https://pixelparadise.com'
  }
},
{
  id: '11',
  name: 'Moonlit Crafts',
  handle: '@moonlitcrafts',
  boothLocations: {
    day1: 'H12',
    day2: 'H12',
    day3: ''
  },
  tags: ['Handmade', 'Crafts', 'Accessories'],
  bio: 'Handcrafted accessories and home decor with a witchy, celestial theme. Each piece is made with love and intention under the moonlight.',
  imageUrl:
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2000&auto=format&fit=crop',
  workImages: [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop'],

  socials: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com'
  }
},
{
  id: '12',
  name: 'Neon Nights',
  handle: '@neonnights',
  boothLocations: {
    day1: 'I08',
    day2: 'I08',
    day3: 'I08'
  },
  tags: ['Cyberpunk', 'Illustration', 'Futuristic'],
  bio: 'Cyberpunk and futuristic cityscapes with neon aesthetics. Digital art prints, posters, and limited edition holographic stickers available.',
  imageUrl:
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2000&auto=format&fit=crop',
  workImages: [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop'],

  socials: {
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    website: 'https://neonnights.art'
  }
},
{
  id: '13',
  name: 'Vintage Vibes',
  handle: '@vintagevibes',
  boothLocations: {
    day1: 'J25',
    day2: '',
    day3: ''
  },
  tags: ['Vintage', 'Retro', 'Illustration'],
  bio: 'Vintage-inspired illustrations with a modern twist. Specializing in retro posters, postcards, and nostalgic artwork from the 60s-80s era.',
  imageUrl:
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2000&auto=format&fit=crop',
  workImages: [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop'],

  socials: {
    instagram: 'https://instagram.com',
    plurk: 'https://plurk.com'
  }
},
{
  id: '14',
  name: 'Kawaii Kingdom',
  handle: '@kawaiikingdom',
  boothLocations: {
    day1: 'K10',
    day2: 'K10',
    day3: 'K10'
  },
  tags: ['Cute', 'Kawaii', 'Stickers'],
  bio: 'Ultra-cute kawaii stickers, pins, and charms. Featuring adorable food characters, animals, and everyday objects with happy faces!',
  imageUrl:
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=2000&auto=format&fit=crop',
  workImages: [
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=800&auto=format&fit=crop'],

  socials: {
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com'
  }
},
{
  id: '15',
  name: 'Mystic Tales',
  handle: '@mystictales',
  boothLocations: {
    day1: '',
    day2: 'L16',
    day3: 'L16'
  },
  tags: ['Fantasy', 'Comics', 'Original'],
  bio: 'Original fantasy comic series featuring magical creatures and epic adventures. First two volumes available, plus character art prints and bookmarks.',
  imageUrl:
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=2000&auto=format&fit=crop',
  workImages: [
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519681393798-38e36fefce15?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1617364852223-75f57e78dc96?q=80&w=800&auto=format&fit=crop'],

  socials: {
    twitter: 'https://twitter.com',
    website: 'https://mystictales.com'
  }
}];

export function App() {
  const [selectedEvent, setSelectedEvent] = useState<Event>(MOCK_EVENTS[0]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const { isDark, toggle: toggleDarkMode } = useDarkMode();
  const handleBookmarkToggle = (id: string) => {
    const newBookmarks = new Set(bookmarkedIds);
    if (newBookmarks.has(id)) {
      newBookmarks.delete(id);
    } else {
      newBookmarks.add(id);
    }
    setBookmarkedIds(newBookmarks);
  };
  return (
    <Router>
      <Layout
        events={MOCK_EVENTS}
        selectedEvent={selectedEvent}
        onEventChange={setSelectedEvent}
        isDark={isDark}
        onDarkModeToggle={toggleDarkMode}>

        <Routes>
          <Route
            path="/"
            element={
            <ArtistDirectory
              artists={MOCK_ARTISTS}
              bookmarkedIds={bookmarkedIds}
              onBookmarkToggle={handleBookmarkToggle} />

            } />

          <Route
            path="/bookmarks"
            element={
            <BookmarksPage
              artists={MOCK_ARTISTS}
              bookmarkedIds={bookmarkedIds}
              onBookmarkToggle={handleBookmarkToggle} />

            } />

        </Routes>
      </Layout>
    </Router>);

}