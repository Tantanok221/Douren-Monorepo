export const UNKNOWN_BOOTH_NAME = "Unknown Booth";

export function normalizeNullableText(value) {
  if (value === null || value === undefined) return null;
  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : null;
}

export function normalizeBoothName(value) {
  return normalizeNullableText(value) ?? UNKNOWN_BOOTH_NAME;
}

export function collectBoothSeeds(rows) {
  const byEventAndName = new Map();

  for (const row of rows) {
    if (row.eventId === null || row.eventId === undefined) continue;

    const eventId = Number(row.eventId);
    const name = normalizeBoothName(row.boothName);
    const key = `${eventId}::${name}`;

    const locationDay01 = normalizeNullableText(row.locationDay01);
    const locationDay02 = normalizeNullableText(row.locationDay02);
    const locationDay03 = normalizeNullableText(row.locationDay03);

    const existing = byEventAndName.get(key);
    if (!existing) {
      byEventAndName.set(key, {
        eventId,
        name,
        locationDay01,
        locationDay02,
        locationDay03,
      });
      continue;
    }

    byEventAndName.set(key, {
      eventId,
      name,
      locationDay01: existing.locationDay01 ?? locationDay01,
      locationDay02: existing.locationDay02 ?? locationDay02,
      locationDay03: existing.locationDay03 ?? locationDay03,
    });
  }

  return [...byEventAndName.values()];
}
