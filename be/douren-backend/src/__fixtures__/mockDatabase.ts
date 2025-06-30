import { vi } from "vitest";
import { mockArtistDbResponse } from "./artistData";
import { mockEventDbResponse, singleEventDbResponse } from "./eventData";
import { mockEventArtistDbResponse } from "./eventArtistData";

export const createMockDatabase = () => {
	const mockReturning = vi.fn().mockResolvedValue(mockArtistDbResponse);
	const mockOnConflictDoNothing = vi.fn().mockReturnValue({
		returning: mockReturning,
	});
	const mockValues = vi.fn().mockReturnValue({
		onConflictDoNothing: mockOnConflictDoNothing,
		returning: mockReturning,
	});
	const mockSet = vi.fn().mockReturnValue({
		where: vi.fn().mockReturnValue({
			returning: mockReturning,
		}),
	});
	const mockWhere = vi.fn().mockReturnValue({
		returning: mockReturning,
	});

	return {
		insert: vi.fn().mockReturnValue({
			values: mockValues,
		}),
		update: vi.fn().mockReturnValue({
			set: mockSet,
		}),
		delete: vi.fn().mockReturnValue({
			where: mockWhere,
		}),
		select: vi.fn().mockReturnValue({
			from: vi.fn().mockReturnValue({
				leftJoin: vi.fn().mockReturnValue({
					leftJoin: vi.fn().mockReturnValue({
						leftJoin: vi.fn().mockReturnValue({
							groupBy: vi.fn().mockReturnValue({
								$dynamic: vi.fn(),
							}),
						}),
					}),
				}),
				where: vi.fn().mockReturnValue({
					orderBy: vi.fn().mockResolvedValue(mockEventDbResponse),
				}),
				orderBy: vi.fn().mockResolvedValue(mockEventDbResponse),
			}),
		}),
		mockReturning,
		mockOnConflictDoNothing,
		mockValues,
		mockSet,
		mockWhere,
	};
};

export const createMockQueryBuilder = () => {
	const mockQuery = { data: "mock query result" };
	return {
		BuildQuery: vi.fn().mockReturnValue({
			SelectQuery: { query: Promise.resolve([mockArtistDbResponse]) },
			CountQuery: { query: Promise.resolve([{ totalCount: 1 }]) },
		}),
		mockQuery,
	};
};

export const createEventMockDatabase = () => {
	const mockEventReturning = vi.fn().mockResolvedValue(mockEventDbResponse);
	const mockEventOnConflictDoNothing = vi.fn().mockReturnValue({
		returning: mockEventReturning,
	});
	const mockEventValues = vi.fn().mockReturnValue({
		onConflictDoNothing: mockEventOnConflictDoNothing,
		returning: mockEventReturning,
	});

	return {
		select: vi.fn().mockReturnValue({
			from: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue([singleEventDbResponse]),
				orderBy: vi.fn().mockResolvedValue(mockEventDbResponse),
			}),
		}),
		insert: vi.fn().mockReturnValue({
			values: mockEventValues,
		}),
		mockEventReturning,
		mockEventOnConflictDoNothing,
		mockEventValues,
	};
};

export const createEventArtistMockDatabase = () => {
	const mockEventArtistReturning = vi
		.fn()
		.mockResolvedValue(mockEventArtistDbResponse);
	const mockEventArtistOnConflictDoNothing = vi.fn().mockReturnValue({
		returning: mockEventArtistReturning,
	});
	const mockEventArtistValues = vi.fn().mockReturnValue({
		onConflictDoNothing: mockEventArtistOnConflictDoNothing,
		returning: mockEventArtistReturning,
	});
	const mockEventArtistSet = vi.fn().mockReturnValue({
		where: vi.fn().mockReturnValue({
			returning: mockEventArtistReturning,
		}),
	});

	return {
		insert: vi.fn().mockReturnValue({
			values: mockEventArtistValues,
		}),
		update: vi.fn().mockReturnValue({
			set: mockEventArtistSet,
		}),
		mockEventArtistReturning,
		mockEventArtistOnConflictDoNothing,
		mockEventArtistValues,
		mockEventArtistSet,
	};
};

export const createEventArtistMockQueryBuilder = () => {
	return {
		BuildQuery: vi.fn().mockReturnValue({
			SelectQuery: { query: Promise.resolve(mockEventArtistDbResponse) },
			CountQuery: { query: Promise.resolve([{ totalCount: 1 }]) },
		}),
	};
};
