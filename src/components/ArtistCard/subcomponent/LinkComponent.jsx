import React from 'react'
import { IoLogoFacebook,IoLogoTwitter,IoLogoYoutube,IoLogoInstagram,IoLogoTwitch    } from "react-icons/io5";
import { SiPlurk,SiPixiv } from "react-icons/si";

export const LinkComponent = ({data}) => {
  if(data.category === "Baha"){
    return <></>
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
    <div>LinkComponent</div>
  )
}
