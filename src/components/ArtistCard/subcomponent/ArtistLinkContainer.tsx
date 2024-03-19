import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { IconContext } from "react-icons";
import { motion } from "framer-motion";
import DMButton from "./DMButton";
import { LinkResult, processLink } from "../../../helper/processLink";
import LinkContainer from "../../LinkContainer/LinkContainer.tsx";
import { useFFContext } from "../FFContext.ts";

interface props {
  children?: React.ReactNode;
}

const ArtistLinkContainer = ({ children }: props) => {
  const sx = classNames.bind(styles);
  const FFData = useFFContext();

  let link: LinkResult[] = [];
  if (FFData) {
    link = processLink(FFData.Facebook_link, FFData.Facebook_name, "Facebook");
    link = link.concat(
      processLink(FFData.Instagram_link, FFData.Instagram_name, "Instagram")
    );
    link = link.concat(
      processLink(FFData.Pixiv_link, FFData.Pixiv_name, "Pixiv")
    );
    link = link.concat(
      processLink(FFData.Twitch_link, FFData.Twitch_name, "Twitch")
    );
    link = link.concat(
      processLink(FFData.Twitter_link, FFData.Twitter_name, "Twitter")
    );
    link = link.concat(
      processLink(FFData.Youtube_link, FFData.Youtube_name, "Youtube")
    );
    link = link.concat(
      processLink(FFData.Plurk_link, FFData.Plurk_name, "Plurk")
    );
    link = link.concat(processLink(FFData.Baha_link, FFData.Baha_name, "Baha"));
    link = link.concat(processLink(FFData.Official_link, "官網", "Other"));
  }

  return (
    <div className={sx("linkContainer")}>
      <IconContext.Provider
        value={{
          color: "#CBC3C3",
          size: "1.5rem",
        }}
      >
        {children}
        <LinkContainer link={link} />
      </IconContext.Provider>
    </div>
  );
};

export default ArtistLinkContainer;
