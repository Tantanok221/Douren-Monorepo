import classNames from "classnames/bind";
import styles from "../EventPage.module.css";
import SortSelect from "../../../components/SortSelect/SortSelect";
import { TagFilter } from "@/components/TagFilter/TagFilter.tsx";
import SelectComponent from "../../../components/SelectComponent/SelectComponent";
import { useState } from "react";
import { useSortSelectContextProvider } from "../-context/SortSelectContext/useSortSelectContextProvider";


const FilterContainer = () => {
  const sx = classNames.bind(styles);
  const [sortValue, setSortValue] = useSortSelectContextProvider();
  return (
    <div className={sx("filterContainer")}>
      <div className={sx("sortSelect")}>
        <SelectComponent onValueChange={setSortValue} defaultValue={sortValue}>
          <SelectComponent.Group>
            <SelectComponent.Label text="排序方式"></SelectComponent.Label>
            <SelectComponent.Item
              text="排序: 作者名稱(順序)"
              value="Author_Main(Author) asc"
            />
            <SelectComponent.Item
              text="排序: 攤位名稱(順序)"
              value="Booth_name asc"
            />
            <SelectComponent.Item
              text="排序: 攤位位置 Day 01(順序)"
              value="Location_Day01 asc"
            />
            <SelectComponent.Item
              text="排序: 攤位位置 Day 02(順序)"
              value="Location_Day02 asc"
            />
            <SelectComponent.Item
              text="排序: 攤位位置 Day 03(順序)"
              value="Location_Day03 asc"
            />
          </SelectComponent.Group>
        </SelectComponent>
      </div>
      <div className={sx("tagFilter")}>
        <TagFilter />
      </div>
    </div>
  );
};

export default FilterContainer;
