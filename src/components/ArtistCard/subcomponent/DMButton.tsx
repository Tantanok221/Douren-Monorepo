import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import linkStyle from "../../LinkContainer/LinkContainer.module.css";
import { useFFContext } from "../FFContext.ts";
import { LazyLoadImage } from "react-lazy-load-image-component";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";
import "react-lazy-load-image-component/src/effects/blur.css";
import LinkIcon from "../../LinkIcon/LinkIcon.tsx";

const DMButton = () => {
  const sx = classNames.bind(styles);
  const ax = classNames.bind(linkStyle);
  const data = useFFContext();
  let link = (data?.DM ?? "").split("\n");

  return data?.DM ? (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <motion.a
          whileHover={{
            backgroundColor: "#4D4D4D",
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className={ax("linkButton")}
        >
          <LinkIcon data={{ category: "DM" }} />
          商品項目
        </motion.a>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay>
          <div className={sx("dialogOverlay")}></div>
        </Dialog.Overlay>
        <Dialog.Content aria-describedby={undefined}>
          <div className={sx("dialogContent")}>
            <VisuallyHidden.Root asChild>
              {/* <IconContext.Provider
                      value={{ color: "#FFFFFF", size: "3rem" }}
                    > */}
              <Dialog.Close className={sx("dialogClose")}>
                {/* <IoClose></IoClose> */}
              </Dialog.Close>
              {/* </IconContext.Provider> */}
            </VisuallyHidden.Root>
            <VisuallyHidden.Root asChild>
              <Dialog.Title />
            </VisuallyHidden.Root>
            <div className={sx("DMContainer")}>
              {link.map((item, index) => {
                return (
                  <LazyLoadImage
                    className={sx("image")}
                    effect="blur"
                    key={index + "DMImage"}
                    src={item}
                  />
                );
              })}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  ) : null;
};

export default DMButton;
