import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import TagContainer from "../../TagContainer";
import { useEventDataContext } from "../EventDataContext";
import { artistSchemaType } from "@pkg/type";
import { useTagFilter } from "../../../stores/useTagFilter.ts";

interface Props {
	size?: "s" | "l";
	activeButton?: boolean;
}

const ArtistTagContainer = ({ size, activeButton }: Props) => {
	const sx = classNames.bind(styles);
	const eventData = useEventDataContext();
	if (!eventData?.tags) return null;
	return (
		<div className={sx("tagContainer")}>
			{
				<TagContainer
					renderTag={eventData.tags}
					size={size}
					activeButton={activeButton}
				/>
			}
		</div>
	);
};

export default ArtistTagContainer;
