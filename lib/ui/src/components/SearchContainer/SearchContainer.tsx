import classNames from "classnames/bind";
import styles from "./SearchContainer.module.css";
import { SelectComponent } from "../SelectComponent";
import { useSearchColumnContext } from "../../context";
import { SearchBox } from "../SearchBox";

export const SearchContainer = () => {
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
            <SelectComponent.Item
              text="創作者名稱"
              value="Author_Main.Author"
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
