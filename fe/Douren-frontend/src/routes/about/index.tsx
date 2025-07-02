import classNames from "classnames/bind";
import styles from "./style.module.css";
import { motion } from "framer-motion";
import { createFileRoute } from "@tanstack/react-router";
import { Animate } from "@/components/Animate/Animate.tsx";
import { AboutCard } from "@/routes/about/-components/AboutCard/AboutCard.tsx";
import { trpc } from "@/helper/trpc.ts";

const OwnerQuery = () => {
  return trpc.owner.getOwner.useQuery();
};

function AboutUs() {
  const sx = classNames.bind(styles);
  const { data } = OwnerQuery();
  console.log(data)
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
export const Route = createFileRoute("/about/")({
  component: AnimateAboutUs,
});
