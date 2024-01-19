import React from "react";
import classNames from "classnames/bind";
import { IoMdSearch } from "react-icons/io";
import { IconContext } from "react-icons";
import styles from "./style.module.css";
import { motion } from "framer-motion";
import { useSearch } from "../../hooks/useSearch";
const SearchBox = () => {
  const sx = classNames.bind(styles);
  const setSearch = useSearch ((state) => state.setSearch);
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <motion.div className={sx("searchBox", { focused: isFocused })}>
      <Icon isFocused={isFocused}></Icon>
      <motion.input
        onChange={(event) => setSearch(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
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
export default SearchBox;
