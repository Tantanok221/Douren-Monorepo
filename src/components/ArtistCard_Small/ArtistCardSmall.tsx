import React from "react";
import ArtistCardSmallContext from "./ArtistCardSmallContext";
import { ArtistTypes } from "../../../types/Artist";
import styles from "./style.module.css";
import classNames from "classnames/bind";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useGetImageSize } from "../../hooks/useGetImageSize";

type Props = {
  data: ArtistTypes;
};

const ArtistCardSmall = ({ data }: Props) => {
  const sx = classNames.bind(styles);
  const width = useGetImageSize();
  return (
    <ArtistCardSmallContext.Provider value={data}>
      <div className={sx("mainContainer")}>
        <div className={sx("imageContainer")}>
          <LazyLoadImage
            width={width}
            alt={data.Author + " pictures"}
            className={sx("image")}
            effect="blur"
            src={data.Photo}
          />
        </div>
        <div className={sx("rightContainer")}>
          <div className={sx('headerContainer')}>
            <div className={sx('header')}>{data.Author}</div>
            <div className={sx('subheader')}>{data.Introduction}</div>
          </div>
          
        </div>
      </div>
    </ArtistCardSmallContext.Provider>
  );
};

export default ArtistCardSmall;
