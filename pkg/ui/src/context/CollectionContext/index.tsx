import { createContext } from "react";
import { useImmerReducer } from "use-immer";
import { eventArtistSchemaType } from "@pkg/type";

export interface ActionType {
	action: "add" | "remove";
	keys: string;
	data: eventArtistSchemaType | undefined;
}
interface contextProps {
	collection: eventArtistSchemaType[] | null;
	dispatch: React.Dispatch<ActionType>;
}

export const CollectionContext = createContext<null | contextProps>(null);

type Props = {
	children: React.ReactNode;
	keys: string;
};

function reducer(
	draft: eventArtistSchemaType[] | null,
	{ action, keys: key, data }: ActionType,
) {
	switch (action) {
		case "add": {
			if (data && draft) {
				draft.push(data);
				localStorage.setItem(key, JSON.stringify(draft));
			}
			return draft;
		}
		case "remove": {
			if (draft && data) {
				const i = draft.findIndex(
					(item) => item.boothName === data.boothName,
				);
				draft.splice(i, 1);
				localStorage.setItem(key, JSON.stringify(draft));
			}
			return draft;
		}
		default: {
			throw new Error("Action not found in CollectionContext");
		}
	}
}

export const CollectionContextProvider = ({ children, keys }: Props) => {
	const item = JSON.parse(localStorage.getItem(keys) || "[]");
	const [collection, dispatch] = useImmerReducer(
		reducer,
		item as eventArtistSchemaType[] | null,
	);
	return (
		<CollectionContext.Provider value={{ collection, dispatch }}>
			{children}
		</CollectionContext.Provider>
	);
};
