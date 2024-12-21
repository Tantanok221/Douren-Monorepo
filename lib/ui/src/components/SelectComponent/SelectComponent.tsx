import style from "./SelectComponent.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import * as Select from "@radix-ui/react-select";
import { CaretDown, IconContext } from "@phosphor-icons/react";
import SelectItem from "./subcomponents/SelectItem";
import SelectLabel from "./subcomponents/SelectLabel";
import SelectGroup from "./subcomponents/SelectGroup";
import { SelectProps } from "@radix-ui/react-select";

interface Props {
  defaultValue: string;
  children: React.ReactNode;
  onValueChange: (value: string) => void;
}

export const SelectComponent = ({
  defaultValue,
  children,
  onValueChange,
}: Props) => {
  const sx = classNames.bind(style);
  return (
    <IconContext.Provider
      value={{
        size: 16,
        color: "#aaaaaa",
      }}
    >
      <Select.Root onValueChange={onValueChange} defaultValue={defaultValue}>
        <Select.Trigger asChild>
          <motion.div
            whileHover={{
              backgroundColor: "#4D4D4D",
            }}
            className={sx("selectTrigger")}
          >
            <motion.div className={sx("selectContainer")}>
              <Select.Value />
              <Select.Icon className={sx("selectIcon")}>
                <CaretDown />
              </Select.Icon>
            </motion.div>
          </motion.div>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content position="popper" className={sx("selectContent")}>
            <Select.Viewport className={sx("selectViewport")}>
              {children}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </IconContext.Provider>
  );
};

SelectComponent.Item = SelectItem;
SelectComponent.Label = SelectLabel;
SelectComponent.Group = SelectGroup;
