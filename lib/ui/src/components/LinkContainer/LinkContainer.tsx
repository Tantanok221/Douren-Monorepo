import style from "./LinkContainer.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { LinkIcon } from "../LinkIcon";

export interface linkObject {
  name?: string;
  link?: string;
  category?: string;
}

interface Props {
  link: linkObject[];
  size?: "s" | "l";
}

export const LinkContainer = ({ link, size }: Props) => {
  const sx = classNames.bind(style);
  return (
    <>
      {link.map((item, index) => (
        <motion.a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className={sx("linkButton", { smallText: size === "s" })}
          key={`${item.link} ${item.category} ${index}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{
            backgroundColor: "#4D4D4D",
          }}
        >
          <div className={sx("linkIcon")}>
            <LinkIcon data={item} />
          </div>
          {item.name}
        </motion.a>
      ))}
    </>
  );
};
