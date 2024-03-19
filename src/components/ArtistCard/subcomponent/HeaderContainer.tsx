import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useFFContext } from "../FFContext.ts";
import TitleContainer from "./TitleContainer.tsx";
import BookmarkContainer from "./BookmarkContainer.tsx";

interface Props {
  bookmarkEnabled?: boolean;
}

const HeaderContainer = ({bookmarkEnabled}:Props) => {
  const sx = classNames.bind(styles);
  return (
    <div className={sx("headerContainer")}>
      <TitleContainer />
      {bookmarkEnabled ? <BookmarkContainer />: null}
    </div>
  );
};

export default HeaderContainer;
