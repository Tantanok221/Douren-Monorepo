import { s } from "@pkg/database/db";
import { sql } from "drizzle-orm";

export const PAGE_SIZE = 40;

export type ENV_VARIABLE = {
  DATABASE_URL: string;
  REDIS_TOKEN: string;
  CLERK_PUBLISHABLE_KEY: string;
  CLERK_SECRET_KEY: string;
  ADMIN_USER_ID: string;
  DEV_ENV: "dev" | "production";
};

export const FETCH_ARTIST_BASE_OBJECT = {
  uuid: s.authorMain.uuid,
  author: s.authorMain.author,
  introduction: s.authorMain.introduction,
  twitterLink: s.authorMain.twitterLink,
  youtubeLink: s.authorMain.youtubeLink,
  facebookLink: s.authorMain.facebookLink,
  instagramLink: s.authorMain.instagramLink,
  pixivLink: s.authorMain.pixivLink,
  plurkLink: s.authorMain.plurkLink,
  bahaLink: s.authorMain.bahaLink,
  twitchLink: s.authorMain.twitchLink,
  myacgLink: s.authorMain.myacgLink,
  storeLink: s.authorMain.storeLink,
  officialLink: s.authorMain.officialLink,
  photo: s.authorMain.photo,
};

export const FETCH_TAG_OBJECT = {
  tags: sql`jsonb_agg(
    jsonb_build_object(
      'tagName', ${s.tag.tag},
      'tagCount', ${s.tag.count}
    )
  )`.as("tags"),
};

export const FETCH_EVENT_BASE_OBJECT = {
  boothName: s.eventDm.boothName,
  locationDay01: s.eventDm.locationDay01,
  locationDay02: s.eventDm.locationDay02,
  locationDay03: s.eventDm.locationDay03,
  DM: s.eventDm.dm,
};

export const FETCH_ARTIST_OBJECT = {
  ...FETCH_ARTIST_BASE_OBJECT,
  ...FETCH_TAG_OBJECT,
};

export const FETCH_EVENT_ARTIST_OBJECT = {
  ...FETCH_ARTIST_BASE_OBJECT,
  ...FETCH_TAG_OBJECT,
  ...FETCH_EVENT_BASE_OBJECT,
};
