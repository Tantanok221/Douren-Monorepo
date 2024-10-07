import React from "react";
import {
  IoLinkOutline,
  IoLogoFacebook,
  IoLogoTwitter,
  IoLogoYoutube,
  IoLogoInstagram,
  IoLogoTwitch,
} from "react-icons/io5";
import { SiPlurk, SiPixiv } from "react-icons/si";
import { GrCatalog } from "react-icons/gr";
import { BiLogoGithub } from "react-icons/bi";
import { FaDiscord } from "react-icons/fa";
import { linkObject } from "../../components/LinkContainer";

interface Props {
  data: linkObject;
}

export const LinkIcon = ({ data }: Props) => {
  if (data.category === "DM") {
    return <GrCatalog/>;
  }
  if (data.category === "Facebook") {
    return <IoLogoFacebook/>;
  }
  if (data.category === "Twitter") {
    return <IoLogoTwitter/>;
  }
  if (data.category === "Youtube") {
    return <IoLogoYoutube/>;
  }
  if (data.category === "Instagram") {
    return <IoLogoInstagram/>;
  }
  if (data.category === "Twitch") {
    return <IoLogoTwitch/>;
  }
  if (data.category === "Plurk") {
    return <SiPlurk/>;
  }
  if (data.category === "Pixiv") {
    return <SiPixiv/>;
  }
  if (data.category === "Github") {
    return <BiLogoGithub/>;
  }
  if (data.category === "Discord") {
    return <FaDiscord/>;
  }
  return <IoLinkOutline/>;
};

export default LinkIcon;
