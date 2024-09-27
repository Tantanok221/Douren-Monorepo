import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useFFContext } from "../FFContext";
import { useArtistCardContext } from "../ArtistCardContext";
import LazyImage from "../../LazyImage";
import { useEventDataContext } from "../EventDataContext";
import { ArtistTypes } from "@/types/Artist.ts";

interface Props {}
const ImageContainer = ({}: Props) => {
  const sx = classNames.bind(styles);
  const data = useFFContext();
  let artistData = useArtistCardContext();
  const eventData = useEventDataContext();
  if (!artistData && !data) {
    artistData = eventData?.Author_Main as ArtistTypes;
  }
  const photo = data ? data.Photo : artistData?.Photo;
  return (
    <div className={sx("imageContainer")}>
      <LazyImage
        alt={artistData?.Author}
        photo={photo}
        
      ></LazyImage>
    </div>
  );
};

export default ImageContainer;
