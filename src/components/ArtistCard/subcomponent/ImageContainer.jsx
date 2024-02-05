import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useArtistCardContext } from "../ArtistCardContext";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useMediaQuery } from '@mantine/hooks';

const ImageContainer = () => {
  const sx = classNames.bind(styles);
  const data = useArtistCardContext()
  let width = "500px"
  const tabSize = useMediaQuery('(min-width: 1300px)');
  
  const phoneSize = useMediaQuery('(max-width: 590px)');
  const smallPhoneSize = useMediaQuery('(max-width: 445px)');
  if(tabSize) {
    width = "48rem"
  }
  if(phoneSize) {
    width = "35rem"
  }
  if(smallPhoneSize){
    width = "25rem"
  }
  return (
    <div className={sx("imageContainer")}>
      <LazyLoadImage width={width} alt={data.author_name + " pictures"} className={sx("image")} effect="blur" src={data.photo} />
    </div>
  );
};

export default ImageContainer;
