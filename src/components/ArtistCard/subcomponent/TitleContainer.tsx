import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useFFContext } from "../FFContext";
import { useArtistCardContext } from "../ArtistCardContext";
const TitleContainer = () => {
  const sx = classNames.bind(styles);
  const data = useFFContext();
  const artistData = useArtistCardContext();
  const title = data ? data.Booth_name : artistData?.Author
  const subtitle = data ? data.Author : artistData?.Introduction
  return (
    <div className={sx("titleContainer")}>
      <div className={sx("header")}>{title}</div>
      <div className={sx("subheader")}>{subtitle}</div>
    </div>
  );
};

export default TitleContainer;
