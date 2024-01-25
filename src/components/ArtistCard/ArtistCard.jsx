import React from "react";
import styles from "./style.module.css";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { IconContext } from "react-icons";
import classNames from "classnames/bind";
import * as Dialog from "@radix-ui/react-dialog";
import { LinkComponent } from "./subcomponent/LinkComponent";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { IoClose } from "react-icons/io5";
import { useCollection } from "../../hooks/useCollection";
import ArtistCardContext from "./ArtistCardContext";
import ImageContainer from "./subcomponent/imageContainer";
import HeaderContainer from "./subcomponent/HeaderContainer";
import BookmarkContainer from "./subcomponent/BookmarkContainer";
import TagContainer from "./subcomponent/TagContainer";

function processLink(links, names, category) {
  if (!links) {
    return [];
  }
  let link = (links ?? "").split("\n");
  let name = (names ?? "")?.split("\n");
  let result = [];

  link?.forEach((item, index) => {
    result.push({
      category: category ?? "",
      link: item ?? "",
      name: name[index] ?? "",
    });
  });
  return result;
}

const ArtistCard = React.forwardRef(({ data, passRef }, ref) => {
  
  const collection = useCollection((state) => state.collection);
  console.log(collection)
  const sx = classNames.bind(styles);
  const boothLocation = [
    data.DAY01_location,
    data.DAY02_location,
    data.DAY03_location,
  ];
  let link = processLink(data.Facebook_link, data.Facebook_name, "Facebook");
  link = link.concat(
    processLink(data.Instagram_link, data.Instagram_name, "Instagram")
  );
  link = link.concat(processLink(data.PIXIV_link, data.PIXIV_name, "Pixiv"));
  link = link.concat(processLink(data.Twitch_link, data.Twitch_name, "Twitch"));
  link = link.concat(
    processLink(data.Twitter_link, data.Twitter_name, "Twitter")
  );
  link = link.concat(
    processLink(data.Youtube_link, data.Youtube_name, "Youtube")
  );
  link = link.concat(processLink(data.Plurk_link, data.Plurk_name, "Plurk"));
  link = link.concat(processLink(data.Baha_link, data.Baha_name, "Baha"));
  link = link.concat(processLink(data.other_website, "官網", "Other"));
  
  return (
    <ArtistCardContext.Provider value={data}>
      <motion.div ref={passRef} className={sx("artistCard")}>
        <motion.div className={sx("mainContainer")}>
        <ImageContainer/>

          <div className={sx("rightContainer")}>
            <div className={sx("firstRow")}>
              <HeaderContainer/>
              <BookmarkContainer/>
            </div>
            <TagContainer/>
            <div className={sx("dayContainer")}>
              {[1, 2, 3].map((day, index) => {
                return (
                  <div key={index} className={sx("dayItem")}>
                    <div className={sx("dayDescription")}>Day {day}</div>
                    <div className={sx("boothDescription")}>
                      {boothLocation[index]}
                    </div>
                  </div>
                );
              })}
            </div>
            <IconContext.Provider
              value={{
                verticalAlign: "middle",
                color: "#CBC3C3",
                size: "1.5rem",
              }}
            >
              <div className={sx("linkContainer")}>
                {data.DM ? (
                  <Dialog.Root>
                    <Dialog.Trigger asChild>
                      <motion.div
                        whileHover={{
                          backgroundColor: "#4D4D4D",
                        }}
                        className={sx("linkButton")}
                      >
                        <LinkComponent data={{ category: "DM" }} />
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
                ) : null}
                {link.map((item, index) => (
                  <motion.a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={sx("linkButton")}
                    key={item + index}
                    whileHover={{
                      backgroundColor: "#4D4D4D",
                    }}
                  >
                    <div className={sx("linkIcon")}>
                      <LinkComponent key={index} data={item} />
                    </div>
                    {item.name}
                  </motion.a>
                ))}
              </div>
            </IconContext.Provider>
          </div>
        </motion.div>
      </motion.div>
    </ArtistCardContext.Provider>
  );
});

export default ArtistCard;
