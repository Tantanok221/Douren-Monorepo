import React from "react";
import style from "./DMButton.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { LinkIcon } from "../LinkIcon";
import linkStyle from "../LinkContainer/LinkContainer.module.css";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

interface Props {
  link: string[];
  text?: string;
}

export const DMButton = ({ link, text }: Props) => {
  const sx = classNames.bind(style);
  const ax = classNames.bind(linkStyle);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <motion.div
          whileHover={{
            backgroundColor: "#4D4D4D",
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className={ax("linkButton")}
        >
          <LinkIcon data={{ category: "DM" }} />
          {text ? text : "商品項目"}
        </motion.div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay>
          <div className={sx("dialogOverlay")}/>
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
                    key={`${item} DMImage`}
                    src={item}
                  />
                );
              })}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

