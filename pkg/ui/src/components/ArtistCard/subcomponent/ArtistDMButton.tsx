import React from "react";
import DMButton from "@components/DMButton";
import { useEventDataContext } from "../EventDataContext.ts";

const ArtistDMButton = () => {
  const eventData = useEventDataContext();
  const link = ( eventData?.DM ?? "").split("\n");

  return link[0] !== "" ? <DMButton link={link}/> : null;
};

export default ArtistDMButton;
