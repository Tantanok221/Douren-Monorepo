import style from "./TemplateName.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";

interface Props {}

const TemplateName = ({}: Props) => {
  const sx = classNames.bind(style);
  return <motion.div className={sx("mainContainer")}>TemplateName </motion.div>;
};

export default TemplateName;
