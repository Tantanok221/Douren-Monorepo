import React, { useEffect } from "react";
import classNames from "classnames/bind";
import { IoMdSearch } from "react-icons/io";
import { IconContext } from "react-icons";
import styles from "./style.module.css";
import { motion } from "framer-motion";
import { useDebouncedValue } from "@mantine/hooks";
import { useSearchContext } from "@/context/SearchContext/useSearchContextProvider.ts";
import { usePaginationContext } from "@/context/PaginationContext/usePaginationContext.ts";

const SearchBox = () => {
  const sx = classNames.bind(styles);
  const [isFocused, setIsFocused] = React.useState(false);
  const [bufferSearch, setBufferSearch] = React.useState("");
  const [debounceSearch] = useDebouncedValue(bufferSearch, 500);
  const [, setSearch] = useSearchContext();
  const [, setPage] = usePaginationContext()
  useEffect(() => {
    setPage(1)
    setSearch(debounceSearch);
  }, [debounceSearch]);

  return (
    <motion.div className={sx("searchBox", { focused: isFocused })}>
      <Icon isFocused={isFocused}></Icon>

      <motion.input
        onChange={(event) => setBufferSearch(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={sx("inputBox")}
        placeholder="搜尋社團/作者名字"
      ></motion.input>
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
export default React.memo(SearchBox);
