export const validArtistData = {
	author: "Test Artist",
	introduction: "Test introduction",
	tags: "原創,插畫",
	photo: "https://example.com/photo.jpg",
};

export const minimalArtistData = {
	author: "Minimal Artist",
};

export const invalidArtistData = {
	author: "",
	uuid: "not-a-number" as any,
};

export const updateArtistData = {
	author: "Updated Artist",
	introduction: "Updated introduction",
	tags: "更新,測試",
	photo: "https://example.com/updated-photo.jpg",
};

export const mockArtistDbResponse = [
	{
		uuid: 1,
		author: "Test Artist",
		introduction: "Test introduction",
		tags: "原創,插畫",
		photo: "https://example.com/photo.jpg",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];
