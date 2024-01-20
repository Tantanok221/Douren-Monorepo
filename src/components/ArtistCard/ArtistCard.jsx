import React from "react";
import styles from "./style.module.css";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { IconContext } from "react-icons";
import { MdOutlineBookmarkBorder } from "react-icons/md";
import classNames from "classnames/bind";
import * as Dialog from "@radix-ui/react-dialog";
import { LinkComponent } from "./subcomponent/LinkComponent";
import { useTagFilter } from "../../hooks/useTagFilter";

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
  const getTag = useTagFilter((state) => state.getTag);
  const allTag = (data.tag ?? "").split(",");
  allTag.splice(allTag.length - 1, 1);
  let renderTag = [];
  allTag.forEach((item, index) => {
    renderTag[index] = getTag(item);
  });
  renderTag = renderTag.flatMap((value) => value);
  return (
    <div ref={passRef}>
      <Dialog.Root>
        <Dialog.Trigger className={sx("artistCard")}>
          <motion.div className={sx("mainContainer")}>
            <div className={sx("imageContainer")}>
              <LazyLoadImage
                className={sx("image")}
                effect="blur"
                src={data.photo}
              />
            </div>

            <div className={sx("rightContainer")}>
              <div className={sx("firstRow")}>
                <div className={sx("headerContainer")}>
                  <div className={sx("header")}>{data.author_name}</div>
                  <div className={sx("subheader")}>{data.doujin_name}</div>
                </div>
                <div className={sx("bookmarkContainer")}>
                  <IconContext.Provider
                    value={{ color: "#AAAAAA", size: "2rem" }}
                  >
                    <MdOutlineBookmarkBorder />
                  </IconContext.Provider>
                </div>
              </div>
              <div className={sx("tagContainer")}>
                {data.tag
                  ? renderTag.map((val, index) => {
                      return (
                        <div key={index + val.tag} className={sx("tagItem")}>
                          <div className={sx("tagDescription")}>{val.tag}</div>
                          <div className={sx("tagCount")}>{val.count}</div>
                        </div>
                      );
                    })
                  : null}
              </div>
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
                value={{ verticalAlign: 'middle', color: "#CBC3C3", size: "1.5rem" }}
              >
                <div className={sx("linkContainer")}>
                  {link.map((item, index) => (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={sx("linkButton")}
                      key={item + index}
                    >
                      <div className={sx("linkIcon")}>
                        <LinkComponent key={index} data={item} />
                      </div>
                      {item.name}
                    </a>
                  ))}
                </div>
              </IconContext.Provider>
            </div>
          </motion.div>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Title>Open DM</Dialog.Title>
            <Dialog.Description>
              This is a modal powered by Radix.
            </Dialog.Description>
            <Dialog.Close />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
});

export default ArtistCard;
