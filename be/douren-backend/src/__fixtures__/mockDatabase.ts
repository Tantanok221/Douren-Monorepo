import { vi } from "vitest";
import { mockArtistDbResponse } from "./artistData";

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
