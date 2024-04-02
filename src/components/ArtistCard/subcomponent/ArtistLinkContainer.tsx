import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { IconContext } from "react-icons";
import { motion } from "framer-motion";
import DMButton from "./DMButton";
import { LinkResult, processLink } from "../../../helper/processLink";
import LinkContainer from "../../LinkContainer/LinkContainer.tsx";
import { useFFContext } from "../FFContext.ts";
import { useArtistCardContext } from "../ArtistCardContext.ts";
import { processArtistData } from "../../../helper/processArtistData.ts";
import { useMediaQuery } from "@mantine/hooks";

interface props {
  children?: React.ReactNode;
  size?: "s" | "l";
}

const ArtistLinkContainer = ({ children,size }: props) => {
  const sx = classNames.bind(styles);
  const FFData = useFFContext();
  const ArtistData = useArtistCardContext();
  size = size ?? "l";
  let fontSize = size === "s" ? "1rem" : "1.5rem";
  let matches = useMediaQuery("(max-width: 1000px)")
  fontSize = matches ? "1.5rem" : fontSize
  let link: LinkResult[] = [];
  if (FFData) {
    link = processLink(FFData.Facebook_link, FFData.Facebook_name, "Facebook");
    link = link.concat(processLink(FFData.Instagram_link, FFData.Instagram_name, "Instagram"));
    link = link.concat(processLink(FFData.Pixiv_link, FFData.Pixiv_name, "Pixiv"));
    link = link.concat(processLink(FFData.Twitch_link, FFData.Twitch_name, "Twitch"));
    link = link.concat(processLink(FFData.Twitter_link, FFData.Twitter_name, "Twitter"));
    link = link.concat(processLink(FFData.Youtube_link, FFData.Youtube_name, "Youtube"));
    link = link.concat(processLink(FFData.Plurk_link, FFData.Plurk_name, "Plurk"));
    link = link.concat(processLink(FFData.Baha_link, FFData.Baha_name, "Baha"));
    link = link.concat(processLink(FFData.Official_link, "官網", "Other"));
  }
  if(ArtistData){
    link = processArtistData(ArtistData);
  }

  return (
    <div className={sx("linkContainer")}>
      <IconContext.Provider
        value={{
          color: "#CBC3C3",
          size: fontSize,
        }}
      >
        {children}
        <LinkContainer size={size} link={link}/>
      </IconContext.Provider>
    </div>
  );
};

export default ArtistLinkContainer;
