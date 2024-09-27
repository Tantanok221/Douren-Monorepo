import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useEventDataContext } from "../EventDataContext";
const DayContainer = () => {
  const sx = classNames.bind(styles);
  const eventData = useEventDataContext();
  let boothLocation: (string | null)[] = [];
  if (eventData) {
    boothLocation = [
      eventData.Location_Day01,
      eventData.Location_Day02,
      eventData.Location_Day03,
    ];
  }
  return (
    <div className={sx("dayContainer")}>
      {[1, 2, 3].map((day, index) => {
        return (
          <div key={index} className={sx("dayItem")}>
            <div className={sx("dayDescription")}>Day {day}</div>
            <div className={sx("boothDescription")}>{boothLocation[index]}</div>
          </div>
        );
      })}
    </div>
  );
};

export default DayContainer;
