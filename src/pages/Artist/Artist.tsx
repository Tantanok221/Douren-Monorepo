import React from "react";
import style from "./Artist.module.css";
import classNames from "classnames/bind";
import { useLocation } from "react-router";
import { artistQuery } from "../../helper/artistQuery";
import { useTagFilter } from "../../hooks/useTagFilter";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import ImageContainer from "../../components/ArtistCard/subcomponent/ImageContainer";
import RightContainer from "../../components/ArtistCard/subcomponent/RightContainer";
import HeaderContainer from "../../components/ArtistCard/subcomponent/HeaderContainer";
import ArtistLinkContainer from "../../components/ArtistCard/subcomponent/ArtistLinkContainer";
import ArtistButton from "../../components/ArtistCard/subcomponent/ArtistButton";
import ArtistTagContainer from "../../components/ArtistCard/subcomponent/ArtistTagContainer";
import NavbarMargin from "../../components/Navbar/subcomponents/NavbarMargin";

type Props = {};

const Artist = (props: Props) => {
  const sx = classNames.bind(style);
  const location = useLocation();
  const { data } = artistQuery();
  console.log(data);
  const setAllFilter = useTagFilter((state) => state.setAllFilter);
  setAllFilter();
  return (
    <>
    <div className={sx("mainContainer")}>
      {data?.map((item, index) => (
        <ArtistCard key={index} artistData={item}>
          <ImageContainer></ImageContainer>
          <RightContainer>
            <HeaderContainer></HeaderContainer>
            <ArtistTagContainer size="s"></ArtistTagContainer>
            <ArtistLinkContainer size="s">
              <ArtistButton size="s"></ArtistButton>
            </ArtistLinkContainer>
          </RightContainer>
        </ArtistCard>
      ))}
    <NavbarMargin></NavbarMargin>
    </div>
      </>
  );
};

export default Artist;
