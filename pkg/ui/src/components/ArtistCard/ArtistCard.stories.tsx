import {Meta, StoryObj} from "@storybook/react";
import ArtistCard from "./ArtistCard.tsx";
import {mockArtistEventData} from "../../index.ts";


const meta: Meta<typeof ArtistCard> = {
    component: ArtistCard,
    args: {
        eventData: mockArtistEventData
    },
    render: ({children,...args} ) => {
        return <ArtistCard {...args}>{children}</ArtistCard>
    }
}

export default meta;
type Story = StoryObj<typeof ArtistCard>

export const Primary: Story = {
      args: {
          children: <>
              <ArtistCard.ImageContainer />
              <ArtistCard.RightContainer>
                  <ArtistCard.HeaderContainer  />
                  <ArtistCard.TagContainer activeButton />
                  <ArtistCard.DayContainer />
                  <ArtistCard.LinkContainer>
                      <ArtistCard.DMButton />
                  </ArtistCard.LinkContainer>
              </ArtistCard.RightContainer>
          </>
      }
}