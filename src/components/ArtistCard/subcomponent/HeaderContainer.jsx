import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useArtistCardContext } from "../ArtistCardContext";
const HeaderContainer = () => {
  const sx = classNames.bind(styles);
  const data = useArtistCardContext();
  return (
    <div className={sx("headerContainer")}>
      <div className={sx("header")}>{data.author_name}</div>
      <div className={sx("subheader")}>{data.doujin_name}</div>
    </div>
  );
};

export default HeaderContainer;
