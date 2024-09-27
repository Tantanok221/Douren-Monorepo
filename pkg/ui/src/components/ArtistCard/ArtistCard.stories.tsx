import { Meta, StoryObj } from "@storybook/react";
import Index from "./";
import { mockArtistEventData } from "@/index.ts";


const meta: Meta<typeof Index> = {
  component: Index,
  args: {
    eventData: mockArtistEventData
  },
  render: ({ children, ...args }) => {
    return <Index {...args}>{children}</Index>;
  }
};

export default meta;
type Story = StoryObj<typeof Index>

export const ArtistEventCard: Story = {
  args: {
    children: <>
      <Index.ImageContainer />
      <Index.RightContainer>
        <Index.HeaderContainer />
        <Index.TagContainer activeButton />
        <Index.DayContainer />
        <Index.LinkContainer>
          <Index.DMButton />
        </Index.LinkContainer>
      </Index.RightContainer>
    </>
  }
};

export const ArtistCard: Story = {
  args: {
    children: <>
      <Index.ImageContainer />
      <Index.RightContainer>
        <Index.HeaderContainer />
        <Index.TagContainer activeButton />
        <Index.LinkContainer>
          <Index.DMButton />
        </Index.LinkContainer>
      </Index.RightContainer>
    </>

  }
};