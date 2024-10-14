import classNames from "classnames/bind";
import styles from "../EventPage.module.css";
import SelectComponent from "../../../components/SelectComponent/SelectComponent";
import SearchBox from "../../../components/SearchBox/SearchBox";
import { useSearchColumnContext } from "@/context/SearchColumnContext/useSearchColumnContext.ts";

const SearchContainer = () => {
  const sx = classNames.bind(styles);
  const [searchColumn, setSearchColumn] = useSearchColumnContext();
  return (
    <form id="top" className={sx("searchContainer")}>
      <div className={sx("searchFilter")}>
        <SelectComponent
          onValueChange={setSearchColumn}
          defaultValue={searchColumn}
        >
          <SelectComponent.Group>
            <SelectComponent.Label text="搜尋欄位" />
            <SelectComponent.Item text="攤位名稱" value="Booth_name" />
            <SelectComponent.Item
              text="創作者名稱"
              value="Author_Main.Author"
            />
            <SelectComponent.Item
              text="攤位位置(Day 01)"
              value="Location_Day01"
            />
            <SelectComponent.Item
              text="攤位位置(Day 02)"
              value="Location_Day02"
            />
            <SelectComponent.Item
              text="攤位位置(Day 03)"
              value="Location_Day03"
            />
          </SelectComponent.Group>
        </SelectComponent>
      </div>
      <div className={sx("searchBox")}>
        <SearchBox />
      </div>
    </form>
  );
};

export default SearchContainer;
