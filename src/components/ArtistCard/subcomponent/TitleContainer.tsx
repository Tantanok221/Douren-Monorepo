import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useArtistCardContext } from "../ArtistCardContext";
const TitleContainer = () => {
  const sx = classNames.bind(styles);
  const data = useArtistCardContext();
  return (
    <div className={sx("titleContainer")}>
      <div className={sx("header")}>{data.Booth_name}</div>
      <div className={sx("subheader")}>{data.Author}</div>
    </div>
  );
};

export default TitleContainer;
