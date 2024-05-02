import React, { useEffect } from "react";
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
import SearchBox from "../../components/SearchBox/SearchBox";
import { useSearch } from "../../hooks/useSearch";

type Props = {};

const Artist = (props: Props) => {
  const sx = classNames.bind(style);
  const location = useLocation();
  const setAllFilter = useTagFilter((state) => state.setAllFilter);
  const resetSearch = useSearch((state) => state.resetSearch);
  useEffect(()=> {
    setAllFilter();
    resetSearch();
  },[])
  const { data } = artistQuery();

  return (
    <>
      <div className={sx("artistPage")}>
        <SearchBox></SearchBox>
        <div className={sx("mainContainer")}>
          {data?.map((item, index) => (
            <ArtistCard key={index} artistData={item}>
              <ImageContainer></ImageContainer>
              <RightContainer>
                <div className={sx("rightHeaderContainer")}>
                  <HeaderContainer></HeaderContainer>
                  <ArtistTagContainer size="s"></ArtistTagContainer>
                </div>
                <ArtistLinkContainer size="s">
                  <ArtistButton size="s"></ArtistButton>
                </ArtistLinkContainer>
              </RightContainer>
            </ArtistCard>
          ))}
        </div>
        <NavbarMargin></NavbarMargin>
      </div>
    </>
  );
};

export default Artist;
