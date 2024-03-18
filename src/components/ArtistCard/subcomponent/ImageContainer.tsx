import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useFFContext } from "../FFContext";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useGetImageSize } from "../../../hooks/useGetImageSize";

const ImageContainer = () => {
  const sx = classNames.bind(styles);
  const data = useFFContext();
  let width = useGetImageSize();
  return (
    <div className={sx("imageContainer")}>
      <LazyLoadImage
        width={width}
        alt={data.Booth_name + " pictures"}
        className={sx("image")}
        effect="blur"
        src={data.Photo}
      />
    </div>
  );
};

export default ImageContainer;
