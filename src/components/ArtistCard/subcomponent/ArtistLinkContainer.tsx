import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useArtistCardContext } from "../ArtistCardContext";
import { IconContext } from "react-icons";

import { motion } from "framer-motion";
import DMButton from "./DMButton";
import { processLink } from "../../../helper/processLink";
import LinkContainer from "../../LinkContainer/LinkContainer.tsx";
const ArtistLinkContainer = () => {
  const sx = classNames.bind(styles);
  const data = useArtistCardContext();
  let link = processLink(data.Facebook_link, data.Facebook_name, "Facebook");
  link = link.concat(
    processLink(data.Instagram_link, data.Instagram_name, "Instagram")
  );
  link = link.concat(processLink(data.Pixiv_link, data.Pixiv_name, "Pixiv"));
  link = link.concat(processLink(data.Twitch_link, data.Twitch_name, "Twitch"));
  link = link.concat(
    processLink(data.Twitter_link, data.Twitter_name, "Twitter")
  );
  link = link.concat(
    processLink(data.Youtube_link, data.Youtube_name, "Youtube")
  );
  link = link.concat(processLink(data.Plurk_link, data.Plurk_name, "Plurk"));
  link = link.concat(processLink(data.Baha_link, data.Baha_name, "Baha"));
  link = link.concat(processLink(data.Official_link, "官網", "Other"));

  return (
    <div className={sx("linkContainer")}>
      <IconContext.Provider
        value={{
          color: "#CBC3C3",
          size: "1.5rem",
        }}
      >
        <DMButton />
        <LinkContainer link={link}/>
      </IconContext.Provider>
    </div>
  );
};


export default ArtistLinkContainer;