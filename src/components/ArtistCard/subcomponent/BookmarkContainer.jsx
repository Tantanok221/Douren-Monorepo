import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useArtistCardContext } from "../ArtistCardContext";
import { MdOutlineBookmarkBorder, MdBookmark } from "react-icons/md";
import { IconContext } from "react-icons";
import { useCollection } from "../../../hooks/useCollection";
const BookmarkContainer = () => {
  const sx = classNames.bind(styles);
  const data = useArtistCardContext();
  const addCollection = useCollection((state) => state.addCollection);
  const removeCollection = useCollection((state) => state.removeCollection);
  const updateLocalStorage = useCollection((state) => state.updateLocalStorage);
  const checkAvailable = useCollection((state) => state.checkAvailable);
  const isAvailable = checkAvailable(data);
  return (
    <div className={sx("bookmarkContainer")} >
      <IconContext.Provider value={{ color: "#AAAAAA", size: "2rem" }}>
        <button
          onClick={(event) => {
            if (!isAvailable) {
              addCollection(data);
            } else {
              removeCollection(data);
            }
            updateLocalStorage();
          }}
          className={sx("bookmarkButton")}
        >
          {!isAvailable ? <MdOutlineBookmarkBorder /> : <MdBookmark />}
        </button>
      </IconContext.Provider>
    </div>
  );
};

export default BookmarkContainer;
