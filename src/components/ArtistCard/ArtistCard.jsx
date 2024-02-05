import React from "react";
import styles from "./style.module.css";
import { motion } from "framer-motion";
import classNames from "classnames/bind";
import { useCollection } from "../../hooks/useCollection";
import ArtistCardContext from "./ArtistCardContext";
import ImageContainer from "./subcomponent/ImageContainer";
import TagContainer from "./subcomponent/TagContainer";
import DayContainer from "./subcomponent/DayContainer";
import ArtistLinkContainer from "./subcomponent/ArtistLinkContainer";
import HeaderContainer from "./subcomponent/HeaderContainer";
import { listVariants } from "../../helper/listAnimation";
const ArtistCard = React.forwardRef(({ index,data, passRef }, ref) => {
  const collection = useCollection((state) => state.collection);
  const sx = classNames.bind(styles);
  return (
    <ArtistCardContext.Provider value={data}>
      <motion.div
        variants={listVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{once: true}}
        ref={passRef}
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
});

export default ArtistCard;
