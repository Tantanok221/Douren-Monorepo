import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useFFContext } from "../FFContext";
import { useArtistCardContext } from "../ArtistCardContext";
import { useEventDataContext } from "../EventDataContext";
import { ArtistTypes } from "../../../types/Artist";

interface Props {
  subtitleDisabled?: boolean;
}

const TitleContainer = ({ subtitleDisabled }: Props) => {
  const sx = classNames.bind(styles);
  const data = useFFContext();
  let artistData = useArtistCardContext();
  const eventData = useEventDataContext();
  if (!artistData && !data) {
    artistData = eventData?.Author_Main as ArtistTypes;
  }

  const subtitle = data ? data.Author : artistData?.Author;
  const title = data ? data.Booth_name : eventData?.Booth_name;
  return (
    <div className={sx("titleContainer")}>
      <div className={sx("header")}>{title}</div>
      {subtitleDisabled ? null : (
        <div className={sx("subheader")}>{subtitle}</div>
      )}
    </div>
  );
};

export default TitleContainer;
