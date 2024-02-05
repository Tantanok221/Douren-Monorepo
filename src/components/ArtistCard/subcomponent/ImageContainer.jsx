import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useArtistCardContext } from "../ArtistCardContext";
import "react-lazy-load-image-component/src/effects/blur.css";

const ImageContainer = () => {
  const sx = classNames.bind(styles);
  const data = useArtistCardContext()
  
  return (
    <div className={sx("imageContainer")}>
      <LazyLoadImage width="500px" alt={data.author_name + " pictures"} className={sx("image")} effect="blur" src={data.photo} />
    </div>
  );
};

export default ImageContainer;
