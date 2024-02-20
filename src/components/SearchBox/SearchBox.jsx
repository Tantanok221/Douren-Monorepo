import React, { useEffect } from "react";
import classNames from "classnames/bind";
import { IoMdSearch } from "react-icons/io";
import { IconContext } from "react-icons";
import styles from "./style.module.css";
import { motion } from "framer-motion";
import { useSearch } from "../../hooks/useSearch";
import { useDebounce } from "@uidotdev/usehooks";

const SearchBox = () => {
  const sx = classNames.bind(styles);
  const setSearch = useSearch((state) => state.setSearch);
  const [isFocused, setIsFocused] = React.useState(false);
  const [bufferSearch, setBufferSearch] = React.useState("");
  const debounceSearch = useDebounce(bufferSearch, 500);

  useEffect(() => {
    setSearch(debounceSearch);
  }, [debounceSearch]);
  return (
    <motion.div className={sx("searchBox", { focused: isFocused })}>
      <Icon isFocused={isFocused}></Icon>

      <motion.input
        onChange={(event) => setBufferSearch(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyPress={(e) => {
          e.key === "Enter" && e.preventDefault();
        }}
        className={sx("inputBox")}
        placeholder="搜尋社團/作者名字"
      ></motion.input>
    </motion.div>
  );
};

const Icon = ({ isFocused }) => {
  return (
    <IconContext.Provider
      value={{ color: isFocused ? "#CBC3C3" : "#AAAAAA", size: "1.75rem" }}
    >
      <IoMdSearch />
    </IconContext.Provider>
  );
};
export default React.memo(SearchBox);
