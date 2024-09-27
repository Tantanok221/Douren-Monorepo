import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useFFContext } from "../FFContext";
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
  const data = useFFContext();
  let artistData = useArtistCardContext();
  const eventData = useEventDataContext();
  if (!artistData && !data) {
    artistData = eventData?.Author_Main as ArtistTypes;
  }

  const allTag = data
    ? (data.Tag ?? "").split(",")
    : artistData?.Tags?.split(",");
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
