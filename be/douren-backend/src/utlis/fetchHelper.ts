export interface ArtistFetchParams {
	searchTable: string;
	page: string;
	search?: string;
	sort: string;
	tag?: string;
	day?: "day1" | "day2" | "day3";
}

export interface EventArtistFetchParams extends ArtistFetchParams {
	eventName: string;
	artistIds?: number[];
}
