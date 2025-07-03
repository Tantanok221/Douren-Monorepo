import React from "react";
import style from "./ArtistPage.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { createFileRoute } from "@tanstack/react-router";
import { NavbarMargin, DataOperationProvider } from "@lib/ui";
import { Animate } from "@/components/Animate/Animate.tsx";
import { ShowcaseLayout } from "@/routes/artist/$artistId/-layout/ShowcaseLayout.tsx";
import useArtistLoader from "@/hooks/useArtistLoader.ts";
import { useFetchTagData } from "@/hooks";
import { processArtistData, useProcessTagData } from "@/helper";
import { ProductLayout } from "@/routes/artist/$artistId/-layout/ProductLayout.tsx";
import { ArtistPageProvider } from "@/routes/artist/$artistId/-context/ArtistPageContext/ArtistPageContext.tsx";

const ArtistPage = () => {
  const id = Route.useParams().artistId;
  const uuid = parseInt(id, 10);
  const { data } = useArtistLoader(uuid);
  const artistData = data || null;
  const tag = useFetchTagData();
  
  if (!artistData) return null;

  const sx = classNames.bind(style);

  return (
    <DataOperationProvider tag={tag}>
      <motion.div className={sx("artistPage")}>
        <ArtistPageProvider data={artistData}>
          <ShowcaseLayout />
          <ProductLayout />
        </ArtistPageProvider>
        <NavbarMargin />
      </motion.div>
    </DataOperationProvider>
  );
};

const AnimateArtistPage = Animate(ArtistPage);
export const Route = createFileRoute("/artist/$artistId/")({
  component: AnimateArtistPage,
});