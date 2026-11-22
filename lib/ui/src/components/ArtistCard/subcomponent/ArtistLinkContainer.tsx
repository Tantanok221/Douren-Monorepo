import { useEventDataContext } from "../EventDataContext.ts";
import { LinkResult, processArtistData } from "../../../helper";
import { LinkContainer } from "../../LinkContainer";
import React from "react";

interface props {
  size?: "s" | "l";
}

export const ArtistLinkContainer = ({ size = "l" }: props) => {
  const eventData = useEventDataContext();
  const link: LinkResult[] = processArtistData(eventData);
  return (
    <>
      <LinkContainer size={size} link={link} />
    </>
  );
};
