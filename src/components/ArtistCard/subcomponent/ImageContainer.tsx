import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useFFContext } from "../FFContext";
import { useArtistCardContext } from "../ArtistCardContext";
import LazyImage from "../../LazyImage/LazyImage";

interface Props {}
const ImageContainer = ({}: Props) => {
  const sx = classNames.bind(styles);
  const data = useFFContext();
  const artistData = useArtistCardContext();
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
