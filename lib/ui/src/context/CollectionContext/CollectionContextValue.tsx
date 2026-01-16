import { createContext } from "react";
import type { useLocalStorage } from "@mantine/hooks";
import type { useImmerReducer } from "use-immer";
import type { eventArtistBaseSchemaType } from "@pkg/type";

export interface ActionType {
  action: "add" | "remove";
  keys: string;
  data: eventArtistBaseSchemaType | undefined;
}
interface contextProps {
  collection: eventArtistBaseSchemaType[] | null;
  dispatch: React.Dispatch<ActionType>;
}

export const CollectionContext = createContext<null | contextProps>(null);
