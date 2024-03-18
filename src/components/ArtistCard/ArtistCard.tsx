import React from "react";
import styles from "./style.module.css";
import { motion } from "framer-motion";
import classNames from "classnames/bind";
import { useCollection } from "../../hooks/useCollection.ts";
import FFContext from "./FFContext.ts";

import { listVariants } from "../../helper/listAnimation";
import { FF } from "../../../types/FF.ts";
import { ArtistTypes } from "../../../types/Artist.ts";
interface Props {
  index?: number;
  data: FF ;
  children?: React.ReactNode;
}
const ArtistCard = React.forwardRef<HTMLDivElement, Props>(
  ({ index, data, children }, ref) => {
    const collection = useCollection((state) => state.collection);
    const sx = classNames.bind(styles);
    return (
      <FFContext.Provider value={data}>
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
      </FFContext.Provider>
    );
  }
);

export default ArtistCard;
