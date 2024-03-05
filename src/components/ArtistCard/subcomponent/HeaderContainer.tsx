import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useArtistCardContext } from "../ArtistCardContext.ts";
import TitleContainer from "./TitleContainer.tsx";
import BookmarkContainer from "./BookmarkContainer.tsx";

const HeaderContainer = () => {
  const sx = classNames.bind(styles);
  return (
    <div className={sx("headerContainer")}>
      <TitleContainer />
      <BookmarkContainer />
    </div>
  );
};

export default HeaderContainer;
