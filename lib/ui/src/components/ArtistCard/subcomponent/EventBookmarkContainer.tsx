import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { MdOutlineBookmarkBorder, MdBookmark } from "react-icons/md";
import { IconContext } from "react-icons";
import { motion } from "framer-motion";
import { useEventDataContext } from "../EventDataContext.ts";
import { useCollectionProvider } from "../../../context/CollectionContext/useCollectionContext.ts";
import { isEventArtistBaseSchema } from "../../../helper/isEventAristBaseSchema.ts";

interface Props {
  keys: string;
}

const EventBookmarkContainer = ({ keys }: Props) => {
  const [click, setClick] = React.useState(1);
  const data = useEventDataContext();
  const sx = classNames.bind(styles);
  const [collection, actions] = useCollectionProvider();
  if (!isEventArtistBaseSchema(data)) return null;
  const isAvailable = collection?.some(
    (item) => item.boothName === data?.boothName,
  );
  return (
    <motion.div whileHover={{ scale: 1.1 }} className={sx("bookmarkContainer")}>
      <IconContext.Provider value={{ color: "#AAAAAA", size: "2rem" }}>
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          onClick={(event) => {
            if (!isAvailable) {
              actions({ action: "add", keys: keys, data: data });
              setClick(click + 1);
            } else {
              actions({ action: "remove", keys: keys, data: data });
              setClick(click + 1);
            }
          }}
          className={sx("bookmarkButton")}
        >
          {!isAvailable ? <MdOutlineBookmarkBorder /> : <MdBookmark />}
        </motion.button>
      </IconContext.Provider>
    </motion.div>
  );
};

export default EventBookmarkContainer;
