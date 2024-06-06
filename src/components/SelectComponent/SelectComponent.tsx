import style from "./SelectComponent.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import * as Select from "@radix-ui/react-select";
import { CaretDown, IconContext } from "@phosphor-icons/react";
import SelectItem from "./subcomponents/SelectItem";
import SelectLabel from "./subcomponents/SelectLabel";
import SelectGroup from "./subcomponents/SelectGroup";

interface Props {
  triggerText: string
  children: React.ReactNode
}

const SelectComponent = ({triggerText,children  }: Props) => {
  const sx = classNames.bind(style);
  return (
    <IconContext.Provider value={{
      size: 16,
      color: '#aaaaaa'
    }}
    >
      <Select.Root >
        <Select.Trigger asChild>
          <motion.div className={sx('selectTrigger')}>
            <motion.div className={sx('selectText')}>
            {triggerText}
            </motion.div>
            <Select.Icon className={sx("selectIcon")}>
            <CaretDown  />
            </Select.Icon>
          </motion.div>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className={sx('selectContent')}>
            {children}
          </Select.Content>
        </Select.Portal>

      </Select.Root>
    </IconContext.Provider>
  );
};

SelectComponent.Item = SelectItem
SelectComponent.Label = SelectLabel
SelectComponent.Group = SelectGroup
export default SelectComponent;
