import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useEventDataContext } from "../EventDataContext";
import {isEventArtistBaseSchema} from "../../../helper/isEventAristBaseSchema.ts";
const DayContainer = () => {
  const sx = classNames.bind(styles);
  const eventData = useEventDataContext();
  if(!isEventArtistBaseSchema(eventData)) return null
  let boothLocation: (string | null | undefined)[] = [];
  boothLocation = [
      eventData?.locationDay01,
      eventData?.locationDay02,
      eventData?.locationDay03,
  ]
  return (
    <div className={sx("dayContainer")}>
      {[1, 2, 3].map((day, index) => {
        return (
          <div key={`day ${day} ${boothLocation[index]}`} className={sx("dayItem")}>
            <div className={sx("dayDescription")}>Day {day}</div>
            <div className={sx("boothDescription")}>{boothLocation[index]}</div>
          </div>
        );
      })}
    </div>
  );
};

export default DayContainer;
