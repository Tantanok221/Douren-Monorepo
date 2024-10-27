import React from "react";
import styles from "../style.module.css";
import classNames from "classnames/bind";
import { IconContext } from "react-icons";
import { IoLibraryOutline } from "react-icons/io5";
import { Link } from "@tanstack/react-router";
import { useMediaQuery } from "@mantine/hooks";
import {useEventDataContext} from "@lib/ui";

interface Props {
  size?: "s" | "l";
}

const ArtistButton = ({ size }: Props) => {
  const sx = classNames.bind(styles);
  const eventData = useEventDataContext();
  size = size ?? "l";
  let fontSize = size === "s" ? "1rem" : "1.5rem";
  const matches = useMediaQuery("(max-width: 1000px)");
  fontSize = matches ? "1.5rem" : fontSize;
  return (
    <IconContext.Provider
      value={{
        color: "#000",
        size: fontSize,
      }}
    >
      <Link
        to={`/artist/${eventData?.uuid}`}
        className={sx("artistButton", "smallText")}
      >
        <IoLibraryOutline />
        詳細資訊
      </Link>
    </IconContext.Provider>
  );
};

export default ArtistButton;
