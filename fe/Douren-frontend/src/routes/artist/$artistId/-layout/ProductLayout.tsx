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
        {artistData?.events && artistData.events[0]?.dm ? (
          <div className={sx("dmText")}>過往DM</div>
        ) : null}
        <div className={sx("dmContainer")}>
          {artistData.events?.map((item, index) => {
            const link = (item?.dm ?? "").split("\n");

            return link[0] != "" ? (
              <div className={sx("dmCard")} key={index + "ArtistID"}>
                <div className={sx("dmEvent")}>{item.event?.name}</div>
                <DMButton link={link}></DMButton>
              </div>
            ) : null;
          })}
        </div>
      </div>
      <div className={sx("mediumContainer")}>
        <div className={sx("dmText")}>作品試閱</div>
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry gutter="15px">
            {artistData.products?.map((item, index) => {
              const link = (item?.preview ?? "").split("\n");
              return (
                <div className={sx("productCard")} key={artistData.author}>
                  <LazyImage
                    width={"100%"}
                    photo={item.thumbnail}
                    alt={item.thumbnail}
                  />
                  <div className={sx("productText")}>{item.title}</div>
                  <DMButton link={link} text="查看產品試閱" />
                </div>
              );
            })}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </>
  );
};
