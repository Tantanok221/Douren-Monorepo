import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import linkStyle from "../../LinkContainer/LinkContainer.module.css";
import { useFFContext } from "../FFContext.ts";
import { LazyLoadImage } from "react-lazy-load-image-component";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";
import LinkIcon from "../../LinkIcon/LinkIcon.tsx";
import DMButton from "../../DMButton/component/DMButton.tsx";
import { useEventDataContext } from "../EventDataContext.ts";

const ArtistDMButton = () => {
  const data = useFFContext();
  const eventData = useEventDataContext();
  const link = ((data ? data?.DM : eventData?.DM )?? "").split("\n");

  return link[0] != "" ? <DMButton link={link}></DMButton> : null;
};

export default ArtistDMButton;
