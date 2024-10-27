import { motion } from "framer-motion";

export const InsertContainer = () => {
  return <div className={"flex rounded-lg flex-row items-center w-full"}>
    <motion.button
      className={"font-sans rounded-lg px-3 py-4 text-center text-tagText font-semibold flex w-full flex-row cursor-pointer bg-panel gap-4 "}
      whileHover={{
        backgroundColor: "#4D4D4D"
      }}>添加新人
    </motion.button>
  </div>;
};