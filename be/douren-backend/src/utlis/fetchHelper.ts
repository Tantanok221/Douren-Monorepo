export interface ArtistFetchParams {
	searchTable: string;
	page: string;
	search?: string;
	sort: string;
	tag?: string;
}

export interface EventArtistFetchParams extends ArtistFetchParams {
	eventName: string;
}
