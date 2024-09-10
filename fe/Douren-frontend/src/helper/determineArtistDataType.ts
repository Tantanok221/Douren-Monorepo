import { ArtistEventType, ArtistTypes } from "../types/Artist";
import { FF } from "../types/FF";
import { Undefined } from "../types/Utility";

export type ArtistDataTypes = "legacy" | "artist" | "event";

export function determineArtistDataType(
  legacyData: Undefined<FF>,
  artistData: Undefined<ArtistTypes>,
  eventData: Undefined<ArtistEventType>,
): ArtistDataTypes {
  if (legacyData) {
    return "legacy";
  } else if (artistData) {
    return "artist";
  } else if (eventData) {
    return "event";
  }
  throw new Error("No data provided in determine data type function");
}
