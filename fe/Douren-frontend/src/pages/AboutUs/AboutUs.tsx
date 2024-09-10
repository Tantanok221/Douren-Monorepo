import classNames from "classnames/bind";
import styles from "./style.module.css";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../helper/supabase.ts";
import AboutCard from "../../components/AboutCard/AboutCard.tsx";
import Animate from "../../animate/Animate.tsx";
import { Owner } from "../../types/Owner.ts";
async function fetchOwner(): Promise<Owner[] | null> {
  const query = supabase.from("Owner").select(`*`);
  const { data } = await query;
  return data;
}
const ownerQuery = () => {
  return useQuery({
    queryKey: ["Owner"],
    queryFn: fetchOwner,
  });
};

function AboutUs() {
  const sx = classNames.bind(styles);
  const { data } = ownerQuery();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.15 }}
      className={sx("mainContainer")}
    >
      <div className={sx("header")}>關於我們</div>

      <div className={sx("authorContainer")}>
        {data
          ? data.map((item, index) => {
              return <AboutCard key={index} author_data={item} />;
            })
          : null}
      </div>
      {/* <div className={sx("dcContainer")}>
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
      </div> */}
    </motion.div>
  );
}
const AnimateAboutUs = Animate(AboutUs);
export default AnimateAboutUs;
