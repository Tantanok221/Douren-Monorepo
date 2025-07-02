import React from "react";
import style from "./AboutCard.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { IconContext } from "react-icons";
import DiscordButton from "./subcomponent/DiscordButton";
import { LinkContainer, processLink } from "@lib/ui";
import { Owner } from "@/types/Owner.ts";

interface Props {
  author_data: Owner;
}

export const AboutCard = ({ author_data }: Props) => {
  const sx = classNames.bind(style);
  let link = processLink(
    author_data.twitterLink,
    author_data.twitterName,
    "Twitter",
  );
  link = link.concat(
    processLink(author_data.githubLink, author_data.githubName, "Github"),
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
            size: "1.25rem",
          }}
        >
          <LinkContainer size="s" link={link} />
          {author_data.discordName ? (
            <DiscordButton size="s" discord_name={author_data.discordName} />
          ) : null}
        </IconContext.Provider>
      </div>
    </motion.div>
  );
};
