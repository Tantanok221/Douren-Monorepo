import {s} from "@pkg/database/db";
import { z } from "zod";
import {sql} from "drizzle-orm";
import artist from "../routes/artist";

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


// Base artist schema
const artistBaseSchema = z.object({
    uuid: z.string(),
    author: z.string(),
    introduction: z.string().nullable(),
    twitterLink: z.string().nullable(),
    youtubeLink: z.string().nullable(),
    facebookLink: z.string().nullable(),
    instagramLink: z.string().nullable(),
    pixivLink: z.string().nullable(),
    plurkLink: z.string().nullable(),
    bahaLink: z.string().nullable(),
    twitchLink: z.string().nullable(),
    myacgLink: z.string().nullable(),
    storeLink: z.string().nullable(),
    officialLink: z.string().nullable(),
    photo: z.string().nullable(),
});

// Tag schema
const tagSchema = z.object({
    tags: z.array(
        z.object({
            tagName: z.string(),
            tagCount: z.number(),
        })
    ),
});

// Event base schema
const eventBaseSchema = z.object({
    boothName: z.string(),
    locationDay01: z.string().nullable(),
    locationDay02: z.string().nullable(),
    locationDay03: z.string().nullable(),
    DM: z.string().nullable(),
});

export const artistInputParams = z.object({
    page: z.string(),
    search: z.string(),
    tag: z.string(),
    sort: z.string(),
    searchtable: z.string()
})

export const eventInputParams = artistInputParams.extend({
    eventId: z.string()
})

// Combined schemas
export const artistSchema = artistBaseSchema.merge(tagSchema);
export type artistSchemaType = z.infer<typeof artistSchema>
export const eventArtistSchema = artistBaseSchema.merge(tagSchema).merge(eventBaseSchema);
export type eventArtistSchemaType = z.infer<typeof eventArtistSchema>
