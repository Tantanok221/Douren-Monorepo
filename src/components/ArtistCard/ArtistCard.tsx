import React from "react";
import styles from "./style.module.css";
import { motion } from "framer-motion";
import classNames from "classnames/bind";
import { useCollection } from "../../hooks/useCollection.ts";
import FFContext from "./FFContext.ts";

import { listVariants } from "../../helper/listAnimation";
import { FF } from "../../types/FF.ts";
import { ArtistEventType, ArtistTypes } from "../../types/Artist.ts";
import ArtistCardContext from "./ArtistCardContext.ts";
import EventDataContext from "./EventDataContext.ts";
interface Props {
  index?: number;
  data?: FF;
  children?: React.ReactNode;
  artistData?: ArtistTypes;
  eventData ?: ArtistEventType;
}
const ArtistCard = React.forwardRef<HTMLDivElement, Props>(
  ({ index, data, children, artistData,eventData }, ref) => {
    const collection = useCollection((state) => state.collection);
    const sx = classNames.bind(styles);
    return (
      <FFContext.Provider value={data}>
        <ArtistCardContext.Provider value={artistData}>
          <EventDataContext.Provider value={eventData}>

          <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            ref={ref}
            className={sx("artistCard")}
            custom={index}
            >
            <motion.div className={sx("mainContainer")}>{children}</motion.div>
          </motion.div>
            </EventDataContext.Provider>
        </ArtistCardContext.Provider>
      </FFContext.Provider>
    );
  },
);

ArtistCard.displayName = "ArtistCard";
export default ArtistCard;
