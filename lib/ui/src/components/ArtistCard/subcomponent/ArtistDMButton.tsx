import React from "react";
import DMButton from "../../DMButton";
import { useEventDataContext } from "../EventDataContext.ts";
import {isEventArtistBaseSchema} from "../../../helper/isEventAristBaseSchema.ts";



const ArtistDMButton = () => {
	const eventData = useEventDataContext();
	if (!isEventArtistBaseSchema(eventData)) {
		return null
	}

	const link = (eventData.DM ?? "").split("\n");
	if (!eventData) return null;

	return link[0] !== "" ? <DMButton link={link} /> : null;
};

export default ArtistDMButton;
