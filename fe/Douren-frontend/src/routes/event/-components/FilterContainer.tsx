import classNames from "classnames/bind";
import styles from "../EventPage.module.css";
import {
  SelectComponent,
  TagFilter,
  useSortSelectContext,
  useUpdatePageSideEffect,
} from "@lib/ui";

const FilterContainer = () => {
  const sx = classNames.bind(styles);
  const [sortValue, setSortValue] = useSortSelectContext();
  const key = [
    { text: "排序: 作者名稱", value: "Author_Main(Author)" },
    { text: "排序: 攤位名稱", value: "Booth_name" },
    { text: "排序: 攤位位置 Day 01", value: "Location_Day01" },
    { text: "排序: 攤位位置 Day 02", value: "Location_Day02" },
    { text: "排序: 攤位位置 Day 03", value: "Location_Day03" },
  ];
  return (
    <div className={sx("filterContainer")}>
      <div className={sx("sortSelect")}>
        <SelectComponent
          onValueChange={useUpdatePageSideEffect(setSortValue, sortValue)}
          defaultValue={sortValue}
        >
          <SelectComponent.Group>
            <SelectComponent.Label text="排序方式"></SelectComponent.Label>
            {key.map((item, index) => (
              <SelectComponent.Item
                key={item.value + "asc"}
                text={item.text + "(順序)"}
                value={item.value + ",asc"}
              />
            ))}
            {key.map((item, index) => (
              <SelectComponent.Item
                key={item.value + "desc"}
                text={item.text + "(逆序)"}
                value={item.value + ",desc"}
              />
            ))}
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
