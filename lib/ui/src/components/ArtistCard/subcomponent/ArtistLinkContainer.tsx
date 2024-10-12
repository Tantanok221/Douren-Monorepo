import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { IconContext } from "react-icons";
import { LinkResult } from "../../../helper/processLink.ts";
import LinkContainer from "../../LinkContainer/";
import { processArtistData } from "../../../helper/processArtistData.ts";
import { useMediaQuery } from "@mantine/hooks";
import { useEventDataContext } from "../EventDataContext.ts";

interface props {
	children?: React.ReactNode;
	size?: "s" | "l";
}

const ArtistLinkContainer = ({ children, size }: props) => {
	const sx = classNames.bind(styles);
	const eventData = useEventDataContext();
	size = size ?? "l";
	let fontSize = size === "s" ? "1rem" : "1.5rem";
	const matches = useMediaQuery("(max-width: 1000px)");
	fontSize = matches ? "1.5rem" : fontSize;
	let link: LinkResult[] = [];
	link = processArtistData(eventData);

	return (
		<div className={sx("linkContainer")}>
			<IconContext.Provider
				value={{
					color: "#CBC3C3",
					size: fontSize,
				}}
			>
				{children}
				<LinkContainer size={size} link={link} />
			</IconContext.Provider>
		</div>
	);
};

export default ArtistLinkContainer;
