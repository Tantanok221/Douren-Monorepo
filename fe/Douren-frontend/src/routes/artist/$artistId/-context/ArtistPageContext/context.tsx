import { ArtistPageTypes } from "@/types";
import { createContext } from "react";

export const ArtistPageContext = createContext<ArtistPageTypes | null>(null);
