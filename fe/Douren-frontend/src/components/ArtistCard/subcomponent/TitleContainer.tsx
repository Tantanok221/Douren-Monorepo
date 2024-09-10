import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { ArtistTypes } from "../../../types/Artist";
import { useFFContext } from "../FFContext";
import { useArtistCardContext } from "../ArtistCardContext";
import { useEventDataContext } from "../EventDataContext";

interface Props {
  subtitleDisabled?: boolean;
}

const TitleContainer = ({ subtitleDisabled }: Props) => {
  const sx = classNames.bind(styles);
  const data = useFFContext();
  const artistData = useArtistCardContext();
  const eventData = useEventDataContext();
  let subtitle: string | null = "";
  let title: string | null = "";
  if (data) {
    title = data?.Booth_name;
  } else if (artistData) {
    title = artistData?.Author;
  } else if (eventData) {
    title = eventData?.Booth_name;
    subtitle = eventData?.Author_Main?.Author;
  }

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
