import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

type Props = {
  width?: string;
  photo: string | undefined;
  alt: string | undefined;
};

const LazyImage = ({ width, alt, photo }: Props) => {
  width = width ?? "100%";
  return (
    <>
      <LazyLoadImage
        width={width}
        alt={alt + " pictures"}
        className="image"
        effect="blur"
        src={photo}
      />
    </>
  );
};

export default LazyImage;
