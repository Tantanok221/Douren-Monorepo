import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { IconContext } from "react-icons";
import { LinkResult, processLink } from "@/helper/processLink.ts";
import LinkContainer from "../../LinkContainer/";
import { useArtistCardContext } from "../ArtistCardContext.ts";
import { processArtistData } from "@/helper/processArtistData.ts";
import { useMediaQuery } from "@mantine/hooks";
import { useEventDataContext } from "../EventDataContext.ts";
import { ArtistTypes } from "@/types/Artist.ts";

interface props {
  children?: React.ReactNode;
  size?: "s" | "l";
}

const ArtistLinkContainer = ({ children, size }: props) => {
  const sx = classNames.bind(styles);
  let artistData = useArtistCardContext();
  const eventData = useEventDataContext();
  if (!artistData ) {
    artistData = eventData?.Author_Main as ArtistTypes;
  }
  size = size ?? "l";
  let fontSize = size === "s" ? "1rem" : "1.5rem";
  const matches = useMediaQuery("(max-width: 1000px)");
  fontSize = matches ? "1.5rem" : fontSize;
  let link: LinkResult[] = [];
  if (artistData) {
    link = processArtistData(artistData);
  }

  return (
    <div className={sx("linkContainer")}>
      <IconContext.Provider
        value={{
          color: "#CBC3C3",
          size: fontSize,
        }}
      >
        {children}
        <LinkContainer size={size} link={link} />
      </IconContext.Provider>
    </div>
  );
};

export default ArtistLinkContainer;
