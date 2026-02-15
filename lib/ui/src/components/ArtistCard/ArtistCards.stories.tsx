import { Meta, StoryObj } from "@storybook/react";
import { ArtistCard } from "./ArtistCard";
import { mockArtistEventData } from "../ArtistCard/ArtistCard";

const meta: Meta<typeof ArtistCard> = {
  component: ArtistCard,
  args: {
    data: mockArtistEventData,
  },
  render: ({ children, ...args }) => {
    return <ArtistCard {...args}>{children}</ArtistCard>;
  },
};

export default meta;
type Story = StoryObj<typeof ArtistCard>;

export const ArtistEventCard: Story = {
  args: {
    children: (
      <>
        <ArtistCard.ImageContainer />
        <ArtistCard.RightContainer>
          <ArtistCard.HeaderContainer keys={"/event/ff43"} />
          <ArtistCard.TagContainer activeButton />
          <ArtistCard.DayContainer />
          <ArtistCard.LinkContainer>
            <ArtistCard.DMButton />
          </ArtistCard.LinkContainer>
        </ArtistCard.RightContainer>
      </>
    ),
  },
};

export const ArtistCardStory: Story = {
  args: {
    children: (
      <>
        <ArtistCard.ImageContainer />
        <ArtistCard.RightContainer>
          <ArtistCard.HeaderContainer />
          <ArtistCard.TagContainer activeButton />
          <ArtistCard.LinkContainer>
            <ArtistCard.DMButton />
          </ArtistCard.LinkContainer>
        </ArtistCard.RightContainer>
      </>
    ),
  },
};
