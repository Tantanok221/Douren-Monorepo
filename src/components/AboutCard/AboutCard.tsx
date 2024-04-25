import React from "react";
import style from "./AboutCard.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { IconContext } from "react-icons";
import { processLink } from "../../helper/processLink";
import LinkContainer from "../LinkContainer/LinkContainer.tsx";
import DiscordButton from "./subcomponent/DiscordButton";
import { Owner } from "../../types/Owner.ts";

interface Props {
  author_data: Owner
}

const AboutCard = ({ author_data  }: Props) => {
  const sx = classNames.bind(style);
  let link = processLink(
    author_data.twitter_link,
    author_data.twitter_name,
    "Twitter"
  );
  link = link.concat(
    processLink(author_data.github_link, author_data.github_name, "Github")
  );
  

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
            color: "#CBC3C3",
            size: "1.5rem",
          }}
        >
          <LinkContainer link={link} />
          {author_data.discord_name ?
          <DiscordButton discord_name={author_data.discord_name}/> : null}
        </IconContext.Provider>
      </div>
    </motion.div>
  );
};

export default AboutCard;
