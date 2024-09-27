import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useArtistCardContext } from "../ArtistCardContext";
import LazyImage from "../../LazyImage";
import { useEventDataContext } from "../EventDataContext";
import { ArtistTypes } from "@/types/Artist.ts";

interface Props {
}

const ImageContainer = ({}: Props) => {
  const sx = classNames.bind(styles);
  let artistData = useArtistCardContext();
  const eventData = useEventDataContext();
  artistData = eventData?.Author_Main as ArtistTypes;
  return (
    <div className={sx("imageContainer")}>
      <LazyImage
        alt={artistData?.Author}
        photo={artistData?.Photo}

      ></LazyImage>
    </div>
  );
};

export default ImageContainer;
