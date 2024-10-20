import classNames from "classnames/bind";
import ArtistStyle from "@lib/ui/src/components/ArtistCard/style.module.css";
import style from "@/routes/artist/$artistId/ArtistPage.module.css";
import { DMButton, LazyImage, LinkContainer, TagContainer } from "@lib/ui";
import { useArtistPageContext } from "@/routes/artist/$artistId/-context/ArtistPageContext/useArtistPageContext.ts";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

export const ProductLayout = () => {
  const ax = classNames.bind(ArtistStyle);
  const sx = classNames.bind(style);
  const artistData = useArtistPageContext();
  return (
    <>
      <div className={sx("bottomContainer")}>
        {artistData?.Event_DM && artistData.Event_DM[0]?.DM ? (
          <div className={sx("dmText")}>過往DM</div>
        ) : null}
        <div className={sx("dmContainer")}>
          {artistData.Event_DM?.map((item, index) => {
            const link = (item?.DM ?? "").split("\n");

            return link[0] != "" ? (
              <div className={sx("dmCard")} key={index + "ArtistID"}>
                <div className={sx("dmEvent")}>{item.Event.name}</div>
                <DMButton link={link}></DMButton>
              </div>
            ) : null;
          })}
        </div>
      </div>
      ;
      <div className={sx("mediumContainer")}>
        <div className={sx("dmText")}>作品試閱</div>
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry gutter="15px">
            {artistData.Author_Product?.map((item, index) => {
              const link = (item?.Preview ?? "").split("\n");
              return (
                <div className={sx("productCard")} key={artistData.Author}>
                  <LazyImage
                    width={"100%"}
                    photo={item.Thumbnail}
                    alt={item.Thumbnail}
                  />
                  <div className={sx("productText")}>{item.Title}</div>
                  <DMButton link={link} text="查看產品試閱" />
                </div>
              );
            })}
          </Masonry>
        </ResponsiveMasonry>
      </div>
      ;
    </>
  );
};
