export const completeArtistData = {
  author: 'Integration Test Artist',
  introduction: 'A comprehensive artist profile for integration testing with all fields populated',
  tags: '原創,測試,Integration',
  photo: 'https://example.com/integration-test.jpg',
  twitterLink: 'https://twitter.com/integration_test',
  officialLink: 'https://integration-test.example.com',
  instagramLink: 'https://instagram.com/integration_test',
  pixivLink: 'https://pixiv.net/users/123456',
  otherLink: 'https://other-platform.com/integration_test'
};

export const minimalArtistData = {
  author: 'Minimal Test Artist',
  introduction: 'Artist with only required fields for testing minimal data validation'
};

export const completeEventData = {
  id: 1,
  name: 'Integration Test Event',
  year: 2024,
  location: 'Test Convention Center',
  description: 'A test event for integration testing purposes',
  startDate: '2024-12-01',
  endDate: '2024-12-03',
  image: 'https://example.com/event-test.jpg',
  website: 'https://test-event.example.com'
};

export const eventArtistWorkflowData = {
  artist: completeArtistData,
  event: completeEventData,
  eventArtist: {
    boothName: 'TEST-01',
    locationDay01: '大廳-TEST01',
    locationDay02: '大廳-TEST02',
    dm: 'https://example.com/test-dm.jpg',
    day01: true,
    day02: true,
    day03: false
  }
};

export const tagTestData = [
  { tag: '原創', count: 0, index: 1 },
  { tag: '測試', count: 0, index: 2 },
  { tag: 'Integration', count: 0, index: 3 },
  { tag: 'Backend', count: 0, index: 4 }
];

export const invalidArtistData = {
  missingAuthor: {
    introduction: 'Artist data without required author field'
  },
  emptyAuthor: {
    author: '',
    introduction: 'Artist with empty author field'
  },
  invalidUrls: {
    author: 'Invalid URL Artist',
    introduction: 'Testing invalid URL validation',
    photo: 'not-a-valid-url',
    twitterLink: 'invalid-twitter-url',
    officialLink: 'not-a-url'
  }
};

export const invalidEventArtistData = {
  nonExistentArtist: {
    artistId: 99999,
    eventId: 1,
    boothName: 'INVALID-01'
  },
  nonExistentEvent: {
    artistId: 1,
    eventId: 99999,
    boothName: 'INVALID-02'
  },
  duplicateBooth: {
    artistId: 1,
    eventId: 1,
    boothName: 'DUPLICATE-01'
  }
};

export const paginationTestData = {
  artists: Array.from({ length: 15 }, (_, i) => ({
    author: `Pagination Test Artist ${i + 1}`,
    introduction: `Artist ${i + 1} for pagination testing`,
    tags: i % 3 === 0 ? '原創' : i % 3 === 1 ? '測試' : 'Integration'
  }))
};

export const searchTestData = {
  artists: [
    {
      author: 'Searchable Artist One',
      introduction: 'Artist with unique searchable content',
      tags: 'Search,Test'
    },
    {
      author: 'Another Searchable Artist',
      introduction: 'Different artist with searchable keywords',
      tags: 'Search,Different'
    },
    {
      author: 'Non-matching Artist',
      introduction: 'Artist that should not match search queries',
      tags: 'Other,Tags'
    }
  ]
};

export const authTestData = {
  validToken: 'test-token',
  invalidToken: 'invalid-token',
  malformedToken: 'malformed.token.structure',
  emptyToken: '',
  validImageToken: 'test-image-token',
  invalidImageToken: 'invalid-image-token'
};