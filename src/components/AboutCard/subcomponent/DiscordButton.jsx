import React from "react";
import LinkIcon from "../../LinkIcon/LinkIcon";
import classNames from "classnames/bind";
import style from "../AboutCard.module.css";
import * as Toast from "@radix-ui/react-toast";


const DiscordButton = ({ discord_name }) => {
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef(0);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const sx = classNames.bind(style);
  return (
    <Toast.Provider>
      <button
        className={sx("linkButton")}
        value={discord_name}
        onClick={(event) => {
          navigator.clipboard.writeText(event.target.value);
          setOpen(false);
          window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(() => {
            setOpen(true);
          }, 100);
        }}
      >
        <LinkIcon data={{ category: "Discord" }}></LinkIcon>
        {discord_name}
      </button>
      <Toast.Root duration={1000} open={open} onOpenChange={setOpen} className={sx('toastRoot')} >
        <Toast.Title className={sx('toastTitle')}>
          Discord 名字已經複製到剪貼簿
        </Toast.Title>
      </Toast.Root>
      <Toast.Viewport className={sx('toastViewport')} />
    </Toast.Provider>
  );
};

export default DiscordButton;
