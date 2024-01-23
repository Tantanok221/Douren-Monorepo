import classNames from 'classnames/bind';
import React from 'react'
import { Outlet } from "react-router-dom";
import { Sidebar } from '../../components/Sidebar/Sidebar';
import style from './root.module.css'
const Root = () => {
  const sx = classNames.bind(style);
  return (
    <div className={sx("Root")}>
      <Sidebar/>
      <Outlet/>
      </div>
    
  )
}

export default Root