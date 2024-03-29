import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useFFContext } from "../FFContext.ts";
import TitleContainer from "./TitleContainer.tsx";
import BookmarkContainer from "./BookmarkContainer.tsx";

interface Props {
  bookmarkEnabled?: boolean;
  subtitleDisabled?: boolean;
}

const HeaderContainer = ({bookmarkEnabled,subtitleDisabled}:Props) => {
  const sx = classNames.bind(styles);
  return (
    <div className={sx("headerContainer")}>
      <TitleContainer subtitleDisabled={subtitleDisabled} />
      {bookmarkEnabled ? <BookmarkContainer />: null}
    </div>
  );
};

export default HeaderContainer;
