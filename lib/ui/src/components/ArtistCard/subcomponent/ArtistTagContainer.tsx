import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import TagContainer from "../../TagContainer";
import { useEventDataContext } from "../EventDataContext";
import { artistSchemaType } from "@pkg/type";

interface Props {
	size?: "s" | "l";
	activeButton?: boolean;
}

const ArtistTagContainer = ({ size, activeButton }: Props) => {
	const sx = classNames.bind(styles);
	const eventData = useEventDataContext();
	const allTag = eventData?.tags;
	return (
		<div className={sx("tagContainer")}>
			{allTag ? (
				<TagContainer
					renderTag={allTag}
					id={eventData?.author}
					size={size}
					activeButton={activeButton}
				/>
			) : null}
		</div>
	);
};

export default ArtistTagContainer;
