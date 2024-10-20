import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import style from "./Pagination.module.css";
import classNames from "classnames/bind";
import { usePagination } from "@mantine/hooks";

interface Props {
  pagination: ReturnType<typeof usePagination>;
}

export const Pagination = ({ pagination }: Props) => {
  const sx = classNames.bind(style);
  const { range, active, next, setPage, previous } = pagination;
  return (
    <div className={sx("paginationContainer")}>
      <div
        onClick={() => previous()}
        className={sx("paginationButton", {
          paginationInactiveButton: range[0] === active,
        })}
      >
        <CaretLeft
          color={active === range[0] ? "#8D8787" : "var(--Link)"}
          size={20}
        />
      </div>
      {range.map((value, index) => {
        if (value === "dots")
          return (
            <div
              key={`paginationDot ${index}"`}
              className={sx("paginationDot")}
            >
              <div className={sx("dot")} />
              <div className={sx("dot")} />
              <div className={sx("dot")} />
            </div>
          );
        return (
          <div
            onClick={() => setPage(value)}
            key={index}
            className={sx("paginationButton", {
              paginationActiveButton: value === active,
            })}
          >
            {value}
          </div>
        );
      })}
      <div
        onClick={() => next()}
        className={sx("paginationButton", {
          paginationInactiveButton: range[range.length - 1] === active,
        })}
      >
        <CaretRight
          color={active === range[range.length - 1] ? "#8D8787" : "var(--Link)"}
          size={20}
        />
      </div>
    </div>
  );
};
