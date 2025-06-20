import { ArtistFormSchema } from "../schema";
import { DisplayText, DisplayTitle } from "./Display.tsx";

interface props {
  artistStep: ArtistFormSchema;
}

export const DisplayArtistStep = ({ artistStep }: props) => {
  return (
    <div className={"gap-6 grid-cols-2 grid"}>
      {Object.keys(artistStep).map((key) => {
        return (
          <>
            <DisplayTitle>{renderArtistKey(key)}</DisplayTitle>
            <DisplayText>artistStep[key]</DisplayText>
          </>
        );
      })}
    </div>
  );
};

function renderArtistKey(key: string) {
  switch (key) {
    case "introduction":
      return "自我介紹";
  }
}
