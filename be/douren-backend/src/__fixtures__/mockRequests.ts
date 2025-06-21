export const createMockRequest = (path: string, method: string, body?: any) => ({
	method,
	headers: new Headers({ 'Content-Type': 'application/json' }),
	body: body ? JSON.stringify(body) : undefined,
});

export const createAuthenticatedRequest = (path: string, method: string, body?: any) => ({
	...createMockRequest(path, method, body),
	headers: new Headers({
		'Content-Type': 'application/json',
		'Authorization': 'Bearer test-token',
	}),
});

export const invalidRequestData = {
	artist: {
		author: '', // Invalid: empty required field
		invalidField: 'should not exist',
	},
	eventArtist: {
		artistId: 'not-a-number', // Invalid: wrong type
		eventId: null, // Invalid: missing required field
	},
};