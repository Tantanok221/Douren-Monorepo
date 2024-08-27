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
import { linkObject } from "../LinkContainer/LinkContainer";

interface Props {
  data: linkObject;
}

export const LinkIcon = ({ data }: Props) => {
  if (data.category === "DM") {
    return <GrCatalog></GrCatalog>;
  }
  if (data.category === "Facebook") {
    return <IoLogoFacebook></IoLogoFacebook>;
  }
  if (data.category === "Twitter") {
    return <IoLogoTwitter></IoLogoTwitter>;
  }
  if (data.category === "Youtube") {
    return <IoLogoYoutube></IoLogoYoutube>;
  }
  if (data.category === "Instagram") {
    return <IoLogoInstagram></IoLogoInstagram>;
  }
  if (data.category === "Twitch") {
    return <IoLogoTwitch></IoLogoTwitch>;
  }
  if (data.category === "Plurk") {
    return <SiPlurk></SiPlurk>;
  }
  if (data.category === "Pixiv") {
    return <SiPixiv></SiPixiv>;
  }
  if (data.category === "Github") {
    return <BiLogoGithub></BiLogoGithub>;
  }
  if (data.category === "Discord") {
    return <FaDiscord></FaDiscord>;
  }
  return <IoLinkOutline></IoLinkOutline>;
};

export default LinkIcon;
