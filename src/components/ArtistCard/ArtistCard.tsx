import React from "react";
import styles from "./style.module.css";
import { motion } from "framer-motion";
import classNames from "classnames/bind";
import { useCollection } from "../../hooks/useCollection.ts";
import ArtistCardContext from "./ArtistCardContext";
import ImageContainer from "./subcomponent/ImageContainer.tsx";
import TagContainer from "./subcomponent/TagContainer";
import DayContainer from "./subcomponent/DayContainer";
import ArtistLinkContainer from "./subcomponent/ArtistLinkContainer";
import HeaderContainer from "./subcomponent/HeaderContainer.tsx";
import { listVariants } from "../../helper/listAnimation";
import { FF } from "../../../types/FF.ts";
interface Props {
  index: number;
  data: FF;
}
const ArtistCard = React.forwardRef<HTMLDivElement, Props>(
  ({ index, data }, ref) => {
    const collection = useCollection((state) => state.collection);
    const sx = classNames.bind(styles);
    return (
      <ArtistCardContext.Provider value={data}>
        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          ref={ref}
          className={sx("artistCard")}
          custom={index}
        >
          <motion.div className={sx("mainContainer")}>
            <ImageContainer />
            <div className={sx("rightContainer")}>
              <HeaderContainer />
              <TagContainer />
              <DayContainer />
              <ArtistLinkContainer />
            </div>
          </motion.div>
        </motion.div>
      </ArtistCardContext.Provider>
    );
  }
);

export default ArtistCard;
