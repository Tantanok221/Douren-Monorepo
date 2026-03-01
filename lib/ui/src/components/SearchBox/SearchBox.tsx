import React, { useEffect } from "react";
import classNames from "classnames/bind";
import { IoMdSearch } from "react-icons/io";
import { IconContext } from "react-icons";
import styles from "./style.module.css";
import { motion } from "framer-motion";
import { useDebouncedValue } from "@mantine/hooks";
import { usePaginationContext } from "../../context/PaginationContext/usePaginationContext";
import { useSearchContext } from "../../context/SearchContext/useSearchContextProvider";

export const SearchBox = () => {
  const sx = classNames.bind(styles);
  const [isFocused, setIsFocused] = React.useState(false);
  const [bufferSearch, setBufferSearch] = React.useState("");
  const [debounceSearch] = useDebouncedValue(bufferSearch, 500);
  const [, setSearch] = useSearchContext();
  const [, setPage] = usePaginationContext();
  useEffect(() => {
    setPage(1);
    setSearch(debounceSearch);
  }, [debounceSearch, setPage, setSearch]);

  return (
    <motion.div className={sx("searchBox", { focused: isFocused })}>
      <Icon isFocused={isFocused} />

      <motion.input
        onChange={(event) => setBufferSearch(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={sx("inputBox")}
        placeholder="搜尋社團/作者名字"
      />
    </motion.div>
  );
};

type IconProps = {
  isFocused: boolean;
};

const Icon = ({ isFocused }: IconProps) => {
  return (
    <IconContext.Provider
      value={{ color: isFocused ? "#CBC3C3" : "#AAAAAA", size: "1.75rem" }}
    >
      <IoMdSearch />
    </IconContext.Provider>
  );
};
