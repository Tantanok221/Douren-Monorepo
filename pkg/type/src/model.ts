import {s} from "@pkg/database/db";
import {z} from "zod";
import {sql} from "drizzle-orm";

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
  uuid: z.number(),
  author: z.string().nullable(),
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

const innerTagSchema = z.object({
  tagName: z.string().nullable(),
  tagCount: z.number().nullable()
})

const tagSchema = z.object({
  tags: z.array(innerTagSchema)
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
  search: z.string().optional(),
  tag: z.string().optional(),
  sort: z.string(),
  searchTable: z.string()
})

export const paginationObject = z.object({
  totalCount: z.number(),
  totalPage: z.number(),
  nextPageAvailable: z.boolean(),
  previousPageAvailable: z.boolean(),
  pageSize: z.number()
})

export const eventInputParams = artistInputParams.extend({
  eventId: z.string()
})

export const eventNameInputParams = z.object(
  {eventName: z.string()}
)

export type eventInputParamsType = z.infer<typeof eventInputParams>
// Combined schemas
export type tagSchemaType = z.infer<typeof innerTagSchema>
export const artistSchema = z.object({
  data: artistBaseSchema.merge(tagSchema).array()
}).merge(paginationObject)
export type artistSchemaType = z.infer<typeof artistSchema>
export const eventArtistBaseSchema = artistBaseSchema.merge(tagSchema).merge(eventBaseSchema)
export const eventArtistSchema = z.object({
  data: eventArtistBaseSchema.array()
}).merge(paginationObject);
export type eventArtistSchemaType = z.infer<typeof eventArtistSchema>
export type eventArtistBaseSchemaType = z.infer<typeof eventArtistBaseSchema>
