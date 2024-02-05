import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useArtistCardContext } from "../ArtistCardContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";
import "react-lazy-load-image-component/src/effects/blur.css";
import LinkIcon from "../../LinkIcon/LinkIcon";
const DMButton = () => {
  const sx = classNames.bind(styles);
  const data = useArtistCardContext();
  return (data.DM ? (
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <motion.div
            whileHover={{
              backgroundColor: "#4D4D4D",
            }}
            initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
            className={sx("linkButton")}
          >
            <LinkIcon data={{ category: "DM" }} />
            商品項目
          </motion.div>
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
                <LazyLoadImage
                  className={sx("image")}
                  effect="blur"
                  src={data.DM}
                />
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    ) : null)
  
};

export default DMButton;
