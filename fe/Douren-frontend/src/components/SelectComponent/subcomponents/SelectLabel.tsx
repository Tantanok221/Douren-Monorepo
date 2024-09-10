import React from 'react'
import * as Select from "@radix-ui/react-select";
import classNames from 'classnames/bind';
import styles from '../SelectComponent.module.css'
type Props = {
  text: string
}

const SelectLabel = ({text}: Props) => {
  const sx = classNames.bind(styles)
  return (
    <Select.Label className={sx('selectLabel')}>{text}</Select.Label>
  )
}

export default SelectLabel