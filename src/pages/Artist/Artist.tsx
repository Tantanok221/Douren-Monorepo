import React from "react";
import style from "./Artist.module.css";
import classNames from "classnames/bind";
import { useLocation } from "react-router";
import { artistQuery } from "../../helper/artistQuery";
import ArtistCardSmall from "../../components/ArtistCard_Small/ArtistCardSmall";
import { useTagFilter } from "../../hooks/useTagFilter";

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
  <ArtistCardSmall key={index} data={item}></ArtistCardSmall>
)}
    
    </div>;
};

export default Artist;
