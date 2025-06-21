export const validEventArtistData = {
	artistId: 1,
	eventId: 1,
	boothName: "A01",
	locationDay01: "大廳-A01",
	locationDay02: "大廳-A02",
	locationDay03: "大廳-A03",
	dm: "https://example.com/dm.jpg",
};

export const minimalEventArtistData = {
	artistId: 1,
	eventId: 1,
	boothName: "B01",
};

export const updateEventArtistData = {
	uuid: 1,
	artistId: 1,
	eventId: 1,
	boothName: "A02",
	locationDay01: "更新-A02",
	dm: "https://example.com/updated-dm.jpg",
};

export const mockEventArtistDbResponse = [
	{
		uuid: 1,
		artistId: 1,
		eventId: 1,
		boothName: "A01",
		locationDay01: "大廳-A01",
		locationDay02: "大廳-A02",
		locationDay03: "大廳-A03",
		dm: "https://example.com/dm.jpg",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

export const mockEventInputParams = {
	page: "1",
	eventName: "FF45",
	tags: "原創",
	search: "test",
};