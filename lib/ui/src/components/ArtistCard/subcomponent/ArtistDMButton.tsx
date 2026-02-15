import React from "react";
import { useEventDataContext } from "../EventDataContext.ts";
import { isEventArtistBaseSchema } from "../../../helper/isEventAristBaseSchema";
import { DMButton } from "../../DMButton/DMButton";

const ArtistDMButton = () => {
  const eventData = useEventDataContext();
  if (!isEventArtistBaseSchema(eventData)) {
    return null;
  }

  const link = (eventData.DM ?? "").split("\n");
  if (!eventData) return null;

  return link[0] !== "" ? <DMButton link={link} /> : null;
};
export default ArtistDMButton;
