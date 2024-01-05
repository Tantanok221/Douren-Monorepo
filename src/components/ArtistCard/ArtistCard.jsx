import React from "react";
import styles from "./style.module.css";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import classNames from "classnames/bind";
import * as Dialog from "@radix-ui/react-dialog";
const ArtistCard = ({ data }) => {
  console.log(data);
  const photoLink = "https://drive.google.com/uc?export=view&id=" +
    data.photo?.substring(33);

  const sx = classNames.bind(styles);

  return (
    <Dialog.Root>
      <Dialog.Trigger className={sx("artistCard")}>
        <motion.div className={sx("mainContainer")}>
          <div className={sx("imageContainer")}>
            <LazyLoadImage
              className={sx("image")}
              effect="blur"
              src={photoLink}
            />
          </div>

          <div className={sx("rightContainer")}>
            <div className={sx("headerContainer")}>
              <div className={sx("header")}>{data.doujin_name}</div>
              <div className={sx("subheader")}>{data.author_name}</div>
            </div>
            <div className={sx("tagContainer")}>
              {data.tag.split(",").map((tag) => (
                <div className={sx("tagItem")}>
                  <div className={sx("tagDescription")}>{tag}</div>
                  <div className={sx("tagCount")}>10</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ArtistCard;
