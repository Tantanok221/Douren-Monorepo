import classNames from "classnames/bind";
import styles from "./style.module.css";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../helper/supabase";
import AboutCard from "../../components/AboutCard/AboutCard";
import LinkContainer from "../../components/LinkContainer/LinkContainer.tsx";
import { IconContext } from "react-icons";
import { DiscordGroup, author_data } from "../../data/author_data.ts";
import Animate from "../../animate/Animate.jsx"
function AboutUs() {
  const sx = classNames.bind(styles);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{duration: 1.15}}
      className={sx("mainContainer")}
    >
      <div className={sx("header")}>關於我們</div>

      <div className={sx("authorContainer")}>
        {author_data.map((item, index) => {
          return <AboutCard key={index} author_data={item} />;
        })}
      </div>
      <div className={sx("dcContainer")}>
        <div className={sx("text")}>
        資料出錯？想換您的圖片？對於網站有任何問題及意見歡迎使用推特或DC私訊小黑蚊
        </div>
        <IconContext.Provider
          value={{
            verticalAlign: "middle",
            color: "#CBC3C3",
            size: "1.5rem",
          }}
        >
          <div className={sx("discordButton")}>
            <LinkContainer link={DiscordGroup} />
          </div>
        </IconContext.Provider>
      </div>
    </motion.div>
  );
}
export default Animate(AboutUs);
