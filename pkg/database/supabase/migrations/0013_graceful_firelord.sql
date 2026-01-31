ALTER TABLE "verification"
	ALTER COLUMN "expires_at"
	SET DATA TYPE timestamp with time zone
	USING "expires_at" AT TIME ZONE 'UTC';
