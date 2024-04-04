import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useFFContext } from "../FFContext";
import { useGetImageSize } from "../../../hooks/useGetImageSize";
import { useArtistCardContext } from "../ArtistCardContext";
import LazyImage from "../../LazyImage/LazyImage";

interface Props {
}
const ImageContainer = ({}:Props) => {
  const sx = classNames.bind(styles);
  const data = useFFContext();
  const artistData = useArtistCardContext();
  let width = useGetImageSize();
  let photo = data ? data.Photo : artistData?.Photo;
  return (
    <div className={sx("imageContainer")}>
      <LazyImage alt={artistData?.Author} photo={photo} width={width}></LazyImage>
    </div>
  );
};

export default ImageContainer;
