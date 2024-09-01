import { s } from "@repo/database/db";
import { sql } from "drizzle-orm";

export const PAGE_SIZE = 40;

export const FETCH_ARTIST_BASE_OBJECT = {
  authorId: s.authorMain.uuid,
  authorName: s.authorMain.author,
  authorDescription: s.authorMain.introduction,
  authorTwitter: s.authorMain.twitterLink,
  authorYoutube: s.authorMain.youtubeLink,
  authorFacebook: s.authorMain.facebookLink,
  authorInstagram: s.authorMain.instagramLink,
  authorPixiv: s.authorMain.pixivLink,
  authorPlurk: s.authorMain.plurkLink,
  authorBaha: s.authorMain.bahaLink,
  authorTwitch: s.authorMain.twitchLink,
  authorMyacg: s.authorMain.myacgLink,
  authorStore: s.authorMain.storeLink,
  authorOfficial: s.authorMain.officialLink,
  authorPhoto: s.authorMain.photo
};

export const FETCH_TAG_OBJECT = {
  tags: sql`jsonb_agg(
    jsonb_build_object(
      'tagName', ${s.tag.tag},
      'tagCount', ${s.tag.count}
    )
  )`.as("tags"),
}

export const FETCH_EVENT_BASE_OBJECT = {
  authorBoothName: s.eventDm.boothName,
  authorDay1Location: s.eventDm.locationDay01,
  authorDay2Location: s.eventDm.locationDay02,
  authorDay3Location: s.eventDm.locationDay03,
  authorDM: s.eventDm.dm,
};

export const FETCH_ARTIST_OBJECT = {
  ...FETCH_ARTIST_BASE_OBJECT,
  ...FETCH_TAG_OBJECT,
}

export const FETCH_EVENT_ARTIST_OBJECT = {
  ...FETCH_ARTIST_BASE_OBJECT,
  ...FETCH_TAG_OBJECT,
  ...FETCH_EVENT_BASE_OBJECT,
}
