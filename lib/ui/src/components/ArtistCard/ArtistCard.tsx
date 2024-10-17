import React from "react";
import styles from "./style.module.css";
import { motion } from "framer-motion";
import classNames from "classnames/bind";
import { listVariants } from "../../helper";
import EventDataContext from "./EventDataContext.ts";
import ImageContainer from "./subcomponent/ImageContainer";
import ArtistButton from "./subcomponent/ArtistButton";
import ArtistDMButton from "./subcomponent/ArtistDMButton";
import ArtistLinkContainer from "./subcomponent/ArtistLinkContainer";
import ArtistTagContainer from "./subcomponent/ArtistTagContainer";
import DayContainer from "./subcomponent/DayContainer";
import EventBookmarkContainer from "./subcomponent/EventBookmarkContainer";
import HeaderContainer from "./subcomponent/HeaderContainer";
import RightContainer from "./subcomponent/RightContainer";
import TitleContainer from "./subcomponent/TitleContainer";
import {
  artistBaseSchemaWithTagType,
  eventArtistBaseSchemaType,
} from "@pkg/type";

interface ArtistCardProps {
  index?: number;
  children?: React.ReactNode;
  data?: eventArtistBaseSchemaType | artistBaseSchemaWithTagType;
}

export const ArtistCard: React.FC<ArtistCardProps> & {
  ImageContainer: typeof ImageContainer;
  Button: typeof ArtistButton;
  DMButton: typeof ArtistDMButton;
  LinkContainer: typeof ArtistLinkContainer;
  TagContainer: typeof ArtistTagContainer;
  DayContainer: typeof DayContainer;
  EventBookmarkContainer: typeof EventBookmarkContainer;
  HeaderContainer: typeof HeaderContainer;
  RightContainer: typeof RightContainer;
  TitleContainer: typeof TitleContainer;
} = ({ index, children, data }: ArtistCardProps) => {
  const sx = classNames.bind(styles);
  return (
    <EventDataContext.Provider value={data}>
      <motion.div
        variants={listVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={sx("artistCard")}
        custom={index}
      >
        <motion.div className={sx("mainContainer")}>{children}</motion.div>
      </motion.div>
    </EventDataContext.Provider>
  );
};

ArtistCard.displayName = "ArtistCard";
ArtistCard.ImageContainer = ImageContainer;
ArtistCard.Button = ArtistButton;
ArtistCard.DMButton = ArtistDMButton;
ArtistCard.LinkContainer = ArtistLinkContainer;
ArtistCard.TagContainer = ArtistTagContainer;
ArtistCard.DayContainer = DayContainer;
ArtistCard.EventBookmarkContainer = EventBookmarkContainer;
ArtistCard.HeaderContainer = HeaderContainer;
ArtistCard.RightContainer = RightContainer;
ArtistCard.TitleContainer = TitleContainer;
