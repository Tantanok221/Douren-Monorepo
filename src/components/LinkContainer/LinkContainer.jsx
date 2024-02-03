import React from "react";
import style from "./LinkContainer.module.css";
import classNames from "classnames/bind";
import {motion} from "framer-motion"
import LinkIcon from "../LinkIcon/LinkIcon";
const LinkContainer = ({link}) => {
  const sx = classNames.bind(style);
  return (<>
  {link.map((item, index) => (
    <motion.a
    href={item.link}
    target="_blank"
    rel="noopener noreferrer"
    className={sx("linkButton")}
    key={item + index}
    whileHover={{
      backgroundColor: "#4D4D4D",
    }}
    >
      <div className={sx("linkIcon")}>
        <LinkIcon key={index} data={item} />
      </div>
      {item.name}
    </motion.a>
  ))}
  </>
  )
}

export default LinkContainer