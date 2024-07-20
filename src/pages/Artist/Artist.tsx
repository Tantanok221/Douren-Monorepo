import React, { useEffect, useState } from "react";
import style from "./Artist.module.css";
import classNames from "classnames/bind";
import { useLocation } from "react-router";
import { useTagFilter } from "../../stores/useTagFilter";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import ImageContainer from "../../components/ArtistCard/subcomponent/ImageContainer";
import RightContainer from "../../components/ArtistCard/subcomponent/RightContainer";
import HeaderContainer from "../../components/ArtistCard/subcomponent/HeaderContainer";
import ArtistLinkContainer from "../../components/ArtistCard/subcomponent/ArtistLinkContainer";
import ArtistButton from "../../components/ArtistCard/subcomponent/ArtistButton";
import ArtistTagContainer from "../../components/ArtistCard/subcomponent/ArtistTagContainer";
import NavbarMargin from "../../components/Navbar/subcomponents/NavbarMargin";
import SearchBox from "../../components/SearchBox/SearchBox";
import { useSearch } from "../../stores/useSearch";
import Animate from "../../animate/Animate";
import { useArtistQuery } from "../../hooks/useArtistQuery";
import { usePagination } from "@mantine/hooks";
import Pagination from "../../components/Pagination/Pagination";
import {  useGetTotalPage } from "../../hooks/useGetTotalPage";

type Props = {};

const Artist = (props: Props) => {
  const sx = classNames.bind(style);
  const location = useLocation();
  const setAllFilter = useTagFilter((state) => state.setAllFilter);
  const resetSearch = useSearch((state) => state.resetSearch);
  useEffect(() => {
    setAllFilter();
    resetSearch();
  }, []);
  const [page, setPage] = useState(1);
  const totalCount = useGetTotalPage("Author_Main") 
  
  const totalPage = Math.ceil(totalCount as number / 10)
  const pagination = usePagination({ total: totalPage, page, siblings: 2, onChange: setPage });
  const { data } = useArtistQuery(page);

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
          <div className={sx('paginationContainer')}>
            <Pagination pagination={pagination }/>
          </div>
        <NavbarMargin></NavbarMargin>
      </div>
    </>
  );
};

const AnimateArtist = Animate(Artist);
export default AnimateArtist;
