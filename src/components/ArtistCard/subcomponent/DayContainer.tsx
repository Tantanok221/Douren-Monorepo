import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useFFContext } from "../FFContext";
import { useEventDataContext } from "../EventDataContext";
const DayContainer = () => {
  const sx = classNames.bind(styles);
  const data = useFFContext();
  const eventData = useEventDataContext();
  let boothLocation: string[] = [];
  if (data?.DAY01_location) {
    const boothLocation = [
      data?.DAY01_location,
      data?.DAY02_location,
      data?.DAY03_location,
    ];
  } else if (eventData?.Location) {
    boothLocation = eventData?.Location?.split(",");
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
