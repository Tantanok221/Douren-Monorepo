import { createMockDatabase } from "./mockDatabase";

export const createMockTrpcContext = () => ({
	db: createMockDatabase(),
	env: {
		DATABASE_URL: 'mock://database',
		DEV_ENV: 'test',
	},
});

export const createMockTrpcOpts = (input: any) => ({
	input,
	ctx: createMockTrpcContext(),
});