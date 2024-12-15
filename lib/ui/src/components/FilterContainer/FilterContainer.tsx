import classNames from "classnames/bind";
import {
  SelectComponent,
  TagFilter,
  useSortSelectContext,
  useUpdatePageSideEffect,
} from "@lib/ui";
import styles from "./FilterContainer.module.css";
interface Key {
  text: string;
  value: string;
}

interface Props {
  sortItem: Key[];
}

export const FilterContainer = ({ sortItem }: Props) => {
  const sx = classNames.bind(styles);
  const [sortValue, setSortValue] = useSortSelectContext();

  return (
    <div className={sx("filterContainer")}>
      <div className={sx("sortSelect")}>
        <SelectComponent
          onValueChange={useUpdatePageSideEffect(setSortValue, sortValue)}
          defaultValue={sortValue}
        >
          <SelectComponent.Group>
            <SelectComponent.Label text="排序方式"></SelectComponent.Label>
            {sortItem.map((item, index) => (
              <SelectComponent.Item
                key={item.value + "asc"}
                text={item.text + "(順序)"}
                value={item.value + ",asc"}
              />
            ))}
            {sortItem.map((item, index) => (
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
