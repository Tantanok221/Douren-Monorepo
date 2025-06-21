export const validEventData = {
	id: 1,
	name: "FF45",
	startDate: "2024-02-10",
	endDate: "2024-02-11",
};

export const duplicateEventData = {
	id: 1,
	name: "Duplicate Event",
};

export const eventWithoutId = {
	name: "Auto ID Event",
};

export const nonExistentEventName = "NonExistent Event";

export const mockEventDbResponse = [
	{
		id: 1,
		name: "FF45",
		startDate: "2024-02-10",
		endDate: "2024-02-11",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

export const singleEventDbResponse = {
	id: 1,
	name: "FF45",
	startDate: "2024-02-10",
	endDate: "2024-02-11",
	createdAt: new Date(),
	updatedAt: new Date(),
};