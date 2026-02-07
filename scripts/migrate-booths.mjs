#!/usr/bin/env node
import postgres from "postgres";

import {
  collectBoothSeeds,
  normalizeBoothName,
  UNKNOWN_BOOTH_NAME,
} from "./booth-backfill-lib.mjs";

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const verbose = args.has("--verbose");
const limitArg = [...args].find((arg) => arg.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined;

if (limitArg && (!Number.isFinite(limit) || limit <= 0)) {
  console.error("Invalid --limit value. Expected positive integer.");
  process.exit(1);
}

const databaseUrl = process.env.DATABASE_URL ?? process.env.LOCAL_DATABASE_URL;
if (!databaseUrl) {
  console.error("Missing LOCAL_DATABASE_URL or DATABASE_URL in environment.");
  process.exit(1);
}

const sql = postgres(databaseUrl, { max: 1 });

function keyOf(seed) {
  return `${seed.eventId}::${seed.name}`;
}

async function assertBoothTableExists() {
  const result = await sql`
    select to_regclass('public.booth') as booth_table;
  `;
  if (!result[0]?.booth_table) {
    throw new Error(
      "booth table does not exist. Run schema migrations first (pnpm run db:migrate).",
    );
  }
}

async function fetchEventDmRows() {
  if (limit) {
    return sql.unsafe(`
      select
        id as "uuid",
        event_id as "eventId",
        booth_name as "boothName",
        location_day01 as "locationDay01",
        location_day02 as "locationDay02",
        location_day03 as "locationDay03",
        booth_id as "boothId"
      from event_dm
      order by id asc
      limit ${limit}
    `);
  }

  return sql`
    select
      id as "uuid",
      event_id as "eventId",
      booth_name as "boothName",
      location_day01 as "locationDay01",
      location_day02 as "locationDay02",
      location_day03 as "locationDay03",
      booth_id as "boothId"
    from event_dm
    order by id asc
  `;
}

async function fetchCoverageCounts() {
  const [result] = await sql`
    select
      count(*) filter (where event_id is not null) as "eventRows",
      count(*) filter (where event_id is not null and booth_id is not null) as "linkedRows",
      count(*) filter (where event_id is not null and booth_id is null) as "unlinkedRows",
      count(distinct booth_id) filter (where booth_id is not null) as "distinctBooths"
    from event_dm
  `;

  return {
    eventRows: Number(result.eventRows ?? 0),
    linkedRows: Number(result.linkedRows ?? 0),
    unlinkedRows: Number(result.unlinkedRows ?? 0),
    distinctBooths: Number(result.distinctBooths ?? 0),
  };
}

async function main() {
  const mode = apply ? "APPLY" : "DRY_RUN";
  console.log(`[booth-migration] mode=${mode}`);

  await assertBoothTableExists();

  const rows = await fetchEventDmRows();
  const eventRows = rows.filter((row) => row.eventId !== null && row.eventId !== undefined);
  const seeds = collectBoothSeeds(eventRows);

  console.log(`[booth-migration] scanned_event_dm_rows=${rows.length}`);
  console.log(`[booth-migration] event_rows=${eventRows.length}`);
  console.log(`[booth-migration] booth_seed_count=${seeds.length}`);

  if (verbose) {
    console.log("[booth-migration] booth seeds preview");
    console.table(seeds.slice(0, 20));
  }

  if (!apply) {
    console.log("[booth-migration] dry-run complete. Re-run with --apply to persist changes.");
    return;
  }

  const updatedRows = await sql.begin(async (tx) => {
    const boothIdByKey = new Map();

    for (const seed of seeds) {
      const [booth] = await tx`
        insert into booth (event_id, name, location_day01, location_day02, location_day03)
        values (${seed.eventId}, ${seed.name}, ${seed.locationDay01}, ${seed.locationDay02}, ${seed.locationDay03})
        on conflict (event_id, name)
        do update set
          location_day01 = coalesce(excluded.location_day01, booth.location_day01),
          location_day02 = coalesce(excluded.location_day02, booth.location_day02),
          location_day03 = coalesce(excluded.location_day03, booth.location_day03)
        returning id, event_id as "eventId", name
      `;

      boothIdByKey.set(keyOf(seed), Number(booth.id));
    }

    let totalUpdated = 0;

    for (const row of eventRows) {
      const eventId = Number(row.eventId);
      const boothName = normalizeBoothName(row.boothName);
      const boothId = boothIdByKey.get(`${eventId}::${boothName}`);
      if (!boothId) continue;

      const result = await tx`
        update event_dm
        set booth_id = ${boothId}
        where id = ${row.uuid}
          and (booth_id is distinct from ${boothId})
      `;

      totalUpdated += Number(result.count ?? 0);
    }

    return totalUpdated;
  });

  const coverage = await fetchCoverageCounts();

  console.log(`[booth-migration] updated_event_dm_rows=${updatedRows}`);
  console.log(`[booth-migration] coverage event_rows=${coverage.eventRows} linked_rows=${coverage.linkedRows} unlinked_rows=${coverage.unlinkedRows} distinct_booths=${coverage.distinctBooths}`);

  if (coverage.unlinkedRows > 0) {
    console.warn(`[booth-migration] warning: ${coverage.unlinkedRows} event_dm rows remain unlinked.`);
  }
}

main()
  .catch((error) => {
    console.error("[booth-migration] failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sql.end({ timeout: 3 });
  });
