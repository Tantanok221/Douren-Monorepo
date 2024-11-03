import React from "react";
import style from "./DMButton.module.css";
import classNames from "classnames/bind";
import * as Dialog from "@radix-ui/react-dialog";
import { LinkIcon } from "../LinkIcon";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Button } from "../Button/Button.tsx";

interface Props {
  link: string[];
  text?: string;
}

export const DMButton = ({ link, text }: Props) => {
  const sx = classNames.bind(style);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>
          <LinkIcon data={{ category: "DM" }} />
          {text ? text : "商品項目"}
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay>
          <div className={sx("dialogOverlay")} />
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
