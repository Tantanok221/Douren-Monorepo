import React from "react";
import classNames from "classnames/bind";
import style from "../../collection.module.css";
import {
  ArtistCard,
  CollectionContextProvider,
  useCollectionProvider,
} from "@lib/ui";
type Props = {
  keys: string;
  title: string;
};

export const CollectionLayout = ({ title, keys }: Props) => {
  const ax = classNames.bind(style);

  if (keys.split("/")[1] === "event") {
    return (
      <div className={ax("ffContainer")}>
        <CollectionContextProvider keys={keys}>
          {<CollectionArtistRenderer keys={keys} title={title} />}
        </CollectionContextProvider>
      </div>
    );
  }
};

const CollectionArtistRenderer = ({
  keys,
  title,
}: {
  keys: string;
  title: string;
}) => {
  const ax = classNames.bind(style);
  const [collection, dispatch] = useCollectionProvider();

  if (!collection) return null;
  return (
    <>
      {collection.length ? <h3 className={ax("h3")}>{title}</h3> : null}
      <div className={ax("artistContainer")}>
        {collection.map((item) => {
          return (
            <ArtistCard key={`${item.boothName}`} data={item}>
              <ArtistCard.ImageContainer />
              <ArtistCard.RightContainer>
                <ArtistCard.HeaderContainer keys={keys} />
                <ArtistCard.TagContainer />
                <ArtistCard.DayContainer />
                <ArtistCard.LinkContainerWrapper>
                  <ArtistCard.DMButton />
                  <ArtistCard.LinkContainer/>
                </ArtistCard.LinkContainerWrapper>
              </ArtistCard.RightContainer>
            </ArtistCard>
          );
        })}
      </div>
    </>
  );
};
