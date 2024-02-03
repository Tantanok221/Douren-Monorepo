import React from 'react'
import { IoLinkOutline,IoLogoFacebook,IoLogoTwitter,IoLogoYoutube,IoLogoInstagram,IoLogoTwitch    } from "react-icons/io5";
import { SiPlurk,SiPixiv } from "react-icons/si";
import { GrCatalog } from "react-icons/gr";

export const LinkComponent = ({data}) => {
  if(data.category === "DM"){
    return <GrCatalog></GrCatalog>
  }
  if(data.category === "Facebook"){
    return <IoLogoFacebook></IoLogoFacebook>
  }
  if(data.category === "Twitter"){
    return <IoLogoTwitter></IoLogoTwitter>
  }
  if(data.category === "Youtube"){
    return <IoLogoYoutube></IoLogoYoutube>
  }
  if(data.category === "Instagram"){
    return <IoLogoInstagram></IoLogoInstagram>
  }
  if(data.category === "Twitch"){
    return <IoLogoTwitch></IoLogoTwitch>
  }
  if(data.category === "Plurk"){
    return <SiPlurk></SiPlurk>
  }
  if(data.category === "Pixiv"){
    return <SiPixiv></SiPixiv>
  }
  
  return (
    <IoLinkOutline></IoLinkOutline>
  )
}

export default LinkComponent