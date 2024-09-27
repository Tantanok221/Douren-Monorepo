import React from "react";
import { useFFContext } from "../FFContext.ts";
import DMButton from "@components/DMButton";
import { useEventDataContext } from "../EventDataContext.ts";

const ArtistDMButton = () => {
  const data = useFFContext();
  const eventData = useEventDataContext();
  const link = ((data ? data?.DM : eventData?.DM )?? "").split("\n");

  return link[0] != "" ? <DMButton link={link}></DMButton> : null;
};

export default ArtistDMButton;
