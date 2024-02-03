import React from "react";
import style from "./AboutCard.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { IconContext } from "react-icons";
import { processLink } from "../../helper/processLink";
import LinkContainer from "../LinkContainer/LinkContainer";
import DiscordButton from "./subcomponent/DiscordButton";
const AboutCard = ({ author_data }) => {
  const sx = classNames.bind(style);
  let link = processLink(
    author_data.twitter_link,
    author_data.twitter_name,
    "Twitter"
  );
  link = link.concat(
    processLink(author_data.github_link, author_data.github_name, "Github")
  );
  
  console.log(link);
  console.log(author_data);
  return (
    <motion.div className={sx("AboutCard")}>
      <div className={sx("header")}>
        <h1 className={sx("title")}>{author_data.name}</h1>
        <h2 className={sx("subtitle")}>{author_data.title}</h2>
      </div>
      <p className={sx("description")}>{author_data.description}</p>
      <div className={sx("linkContainer")}>
        <IconContext.Provider
          value={{
            verticalAlign: "middle",
            color: "#CBC3C3",
            size: "1.5rem",
          }}
        >
          <LinkContainer link={link} />
          <DiscordButton discord_name={author_data.discord_name}/>
        </IconContext.Provider>
      </div>
    </motion.div>
  );
};

export default AboutCard;
