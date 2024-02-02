import classNames from "classnames/bind";
import styles from "./style.module.css";
import { motion } from "framer-motion";

function AboutUs() {
  const sx = classNames.bind(styles);
  return (
    <div className={sx("MainContainer")}>
      <div className={sx("Header")}></div>
      
    </div>
  );
}
export default AboutUs;
