import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { MdOutlineBookmarkBorder, MdBookmark } from "react-icons/md";
import { IconContext } from "react-icons";
import { useLegacyCollection } from "../../../stores/useLegacyCollection.ts";
import { motion } from "framer-motion";
import { useFFContext } from "../FFContext.ts";

interface Props {
  keys: string;

}

const LegacyBookmarkContainer = ({keys}:Props) => {
  const [click, setClick] = React.useState(1);
  const sx = classNames.bind(styles);
  const data = useFFContext();
  const addCollection = useLegacyCollection((state) => state.addCollection);
  const removeCollection = useLegacyCollection((state) => state.removeCollection);
  const updateLocalStorage = useLegacyCollection((state) => state.updateLocalStorage);
  const checkAvailable = useLegacyCollection((state) => state.checkAvailable);
  const isAvailable = checkAvailable(data);
  return (
    <motion.div whileHover={{ scale: 1.1 }} className={sx("bookmarkContainer")}>
      <IconContext.Provider value={{ color: "#AAAAAA", size: "2rem" }}>
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          onClick={(event) => {
            if (!isAvailable) {
              addCollection(data);
              setClick(click + 1);
            } else {
              removeCollection(data);
              setClick(click + 1);
            }
            updateLocalStorage(keys);
          }}
          className={sx("bookmarkButton")}
        >
          {!isAvailable ? <MdOutlineBookmarkBorder /> : <MdBookmark />}
        </motion.button>
      </IconContext.Provider>
    </motion.div>
  );
};

export default LegacyBookmarkContainer;
