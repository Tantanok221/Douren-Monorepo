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
import TagContainer from "../../components/ArtistCard/subcomponent/TagContainer";
import ArtistLinkContainer from "../../components/ArtistCard/subcomponent/ArtistLinkContainer";

type Props = {};

const Artist = (props: Props) => {
  const sx = classNames.bind(style);
  const location = useLocation();
  const {data} = artistQuery()
  console.log(data)
  const setAllFilter = useTagFilter((state) => state.setAllFilter);
  setAllFilter(); 
  return <div className={sx("mainContainer")}>
    {data?.map((item, index) => 
  <ArtistCard key={index} artistData={item}>
    <ImageContainer></ImageContainer>
    <RightContainer>
      <HeaderContainer></HeaderContainer>
      <TagContainer size="s"></TagContainer>
      <ArtistLinkContainer size="s"></ArtistLinkContainer>
    </RightContainer>
    </ArtistCard>
)}
    
    </div>;
};

export default Artist;
