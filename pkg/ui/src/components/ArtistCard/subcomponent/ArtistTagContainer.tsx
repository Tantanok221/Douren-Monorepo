import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useArtistCardContext } from "../ArtistCardContext";
import { processTagData } from "@/helper/processTagData.ts";
import TagContainer from "../../TagContainer";
import { useEventDataContext } from "../EventDataContext";
import { ArtistTypes } from "@/types/Artist.ts";

interface Props {
  size?: "s" | "l";
  activeButton?: boolean;
}

const ArtistTagContainer = ({ size, activeButton }: Props) => {
  const sx = classNames.bind(styles);
  let artistData = useArtistCardContext();
  const eventData = useEventDataContext();
  if (!artistData) {
    artistData = eventData?.Author_Main as ArtistTypes;
  }

  const allTag = artistData?.Tags?.split(",");
  const renderTag = processTagData(allTag ?? []);
  return (
    <div className={sx("tagContainer")}>
      <TagContainer
        renderTag={renderTag}
        size={size}
        activeButton={activeButton}
      ></TagContainer>
    </div>
  );
};

export default ArtistTagContainer;
