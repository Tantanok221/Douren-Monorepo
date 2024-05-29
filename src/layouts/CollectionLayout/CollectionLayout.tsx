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
import style from "./CollectionLayout.module.css";
type Props = {
  keys: string;
  legacyData?: FF[];
  eventData?: ArtistEventType[];
};

const CollectionLayout = ({ keys, legacyData, eventData }: Props) => {
  const sx = classNames.bind(style);

  if (legacyData) {
    return (
      <>
        {legacyData.map((item) => {
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
      </>
    );
  } else if (eventData) {
    return (
      <>
        {eventData.map((item) => {
          return (
            <ArtistCard key={`${item.Author_Main.uuid}`} eventData={item}>
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
      </>
    );
  }
};

export default CollectionLayout;
