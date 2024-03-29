import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useFFContext } from "../FFContext";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useGetImageSize } from "../../../hooks/useGetImageSize";
import { useArtistCardContext } from "../ArtistCardContext";

interface Props {
  followContainerSize?: boolean;

}
const ImageContainer = ({followContainerSize}:Props) => {
  const sx = classNames.bind(styles);
  const data = useFFContext();
  const artistData = useArtistCardContext();
  let width = useGetImageSize();
  let photo = data ? data.Photo : artistData?.Photo;
  return (
    <div className={sx("imageContainer")}>
      <LazyLoadImage
        width={followContainerSize ? "" : width}
        alt={data?.Booth_name  + " pictures"}
        className={sx("image")}
        effect="blur"
        src={photo}
      />
    </div>
  );
};

export default ImageContainer;
