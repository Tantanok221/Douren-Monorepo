import * as Select from "@radix-ui/react-select";
import classNames from "classnames/bind";
import React from 'react'
import styles from '../SelectComponent.module.css'
type Props = {
  value: string
  text: string
}

function SelectItem({value,text}: Props) {
  const sx = classNames.bind(styles)
  return (
    <Select.Item value={value} className={sx('selectItem')}>
      <Select.ItemText className={sx('selectItemText')}>{text}</Select.ItemText>
    </Select.Item>
  )}

export default SelectItem