import { useEventDataContext } from "../EventDataContext.ts";
import { LinkResult, processArtistData } from "../../../helper/processArtistData";
import { LinkContainer } from "../../LinkContainer";
import React from "react";

interface props {
  size?: "s" | "l";
}

export const ArtistLinkContainer = ({ size }: props) => {
  size = size ?? "l";
  const eventData = useEventDataContext();
  let link: LinkResult[] = [];
  link = processArtistData(eventData);
  return (
    <>
      <LinkContainer size={size} link={link} />
    </>
  );
};
