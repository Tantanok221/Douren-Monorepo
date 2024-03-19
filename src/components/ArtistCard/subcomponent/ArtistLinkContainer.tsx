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

interface props {
  children?: React.ReactNode;
  size?: "s" | "l";
}

const ArtistLinkContainer = ({ children,size }: props) => {
  const sx = classNames.bind(styles);
  const FFData = useFFContext();
  const ArtistData = useArtistCardContext();
  size = size ?? "l";
  const fontSize = size === "s" ? "1rem" : "1.5rem";
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
    link = processLink(ArtistData.Facebook_link, ArtistData.Author, "Facebook");
    link = link.concat(processLink(ArtistData.Instagram_link, ArtistData.Author, "Instagram"));
    link = link.concat(processLink(ArtistData.Pixiv_link, ArtistData.Author, "Pixiv"));
    link = link.concat(processLink(ArtistData.Twitch_link, ArtistData.Author, "Twitch"));
    link = link.concat(processLink(ArtistData.Twitter_link, ArtistData.Author, "Twitter"));
    link = link.concat(processLink(ArtistData.Youtube_link, ArtistData.Author, "Youtube"));
    link = link.concat(processLink(ArtistData.Plurk_link, ArtistData.Author, "Plurk"));
    link = link.concat(processLink(ArtistData.Baha_link, ArtistData.Author, "Baha"));
    link = link.concat(processLink(ArtistData.Official_link, "官網", "Other"))
    link = link.concat(processLink(ArtistData.Store_link, "商店", "Store"))
    link = link.concat(processLink(ArtistData.Myacg_link, "MYACG", "Other"))
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
