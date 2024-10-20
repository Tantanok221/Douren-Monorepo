import React from "react";
import style from "./ArtistPage.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { createFileRoute } from "@tanstack/react-router";
import {
  NavbarMargin
} from "@lib/ui";
import { Animate } from "@/components/Animate/Animate.tsx";
import { ShowcaseLayout } from "@/routes/artist/$artistId/-layout/ShowcaseLayout.tsx";
import useArtistLoader from "@/hooks/useArtistLoader.ts";
import { ArtistPageTypes } from "@/types";
import { processArtistData, useProcessTagData } from "@/helper";
import { ProductLayout } from "@/routes/artist/$artistId/-layout/ProductLayout.tsx";
import { ArtistPageProvider } from "@/routes/artist/$artistId/-context/ArtistPageContext/ArtistPageContext.tsx";

const ArtistPage = () => {
  const id = Route.useParams().artistId;
  const uuid = parseInt(id, 10);
  const { data } = useArtistLoader(uuid);
  const artistData: ArtistPageTypes | null = data ? data[0] : null;
  if (!artistData) return null;

  const sx = classNames.bind(style);


  return (
    <motion.div className={sx("artistPage")}>
      <ArtistPageProvider data={artistData}>
        <ShowcaseLayout />
        <ProductLayout />
      </ArtistPageProvider>
      <NavbarMargin />
    </motion.div>
  );
};
const AnimateArtistPage = Animate(ArtistPage);
export const Route = createFileRoute("/artist/$artistId/")({
  component: AnimateArtistPage
});
