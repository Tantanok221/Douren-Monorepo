import React from "react";
import { FF } from "../../types/FF";
import { ArtistEventType } from "../../types/Artist";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import ImageContainer from "../../components/ArtistCard/subcomponent/ImageContainer";
import RightContainer from "../../components/ArtistCard/subcomponent/RightContainer";
import HeaderContainer from "../../components/ArtistCard/subcomponent/HeaderContainer";
import ArtistTagContainer from "../../components/ArtistCard/subcomponent/ArtistTagContainer";
import DayContainer from "../../components/ArtistCard/subcomponent/DayContainer";
import ArtistLinkContainer from "../../components/ArtistCard/subcomponent/ArtistLinkContainer";
import ArtistDMButton from "../../components/ArtistCard/subcomponent/ArtistDMButton";
import classNames from "classnames/bind";
import style from "../../pages/Collection/Collection.module.css";
import { CollectionContextProvider } from "../../context/CollectionContext/CollectionContext";
import { useCollectionProvider } from "../../context/CollectionContext/useCollectionContext";
type Props = {
  keys: string;
  legacyData?: FF[];
  title: string;
};

const CollectionLayout = ({ title, keys, legacyData }: Props) => {
  const ax = classNames.bind(style);

  if ((legacyData ?? []).length >= 1) {
    return (
      <div className={ax("ffContainer")}>
        <h3 className={ax("h3")}>{title}</h3>
        <div className={ax("artistContainer")}>
          {legacyData?.map((item) => {
            return (
              <ArtistCard key={`${item.uuid}`} legacyData={item}>
                <ImageContainer />
                <RightContainer>
                  <HeaderContainer keys={keys} />
                  <ArtistTagContainer />
                  <DayContainer />
                  <ArtistLinkContainer>
                    <ArtistDMButton />
                  </ArtistLinkContainer>
                </RightContainer>
              </ArtistCard>
            );
          })}
        </div>
      </div>
    );
  } else if (keys.split("/")[1] === "event") {
    return (
      <div className={ax("ffContainer")}>
        <CollectionContextProvider keys={keys}>
          {<CollectionArtistRenderer keys={keys} title={title} />}
        </CollectionContextProvider>
      </div>
    );
  }
};

const CollectionArtistRenderer = ({
  keys,
  title,
}: {
  keys: string;
  title: string;
}) => {
  const ax = classNames.bind(style);
  const [collection, dispatch] = useCollectionProvider();

  if (!collection) return null;
  return (
    <>
      {collection.length ? <h3 className={ax("h3")}>{title}</h3> : null}
      <div className={ax("artistContainer")}>
        {collection.map((item) => {
          return (
            <ArtistCard key={`${item.Booth_name}`} eventData={item}>
              <ImageContainer />
              <RightContainer>
                <HeaderContainer keys={keys} />
                <ArtistTagContainer />
                <DayContainer />
                <ArtistLinkContainer>
                  <ArtistDMButton />
                </ArtistLinkContainer>
              </RightContainer>
            </ArtistCard>
          );
        })}
      </div>
    </>
  );
};

export default CollectionLayout;
