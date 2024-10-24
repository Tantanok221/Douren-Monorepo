import { createFileRoute } from "@tanstack/react-router";
import { DataOperationProvider, FilterContainer, SearchContainer, styled } from "@lib/ui";
import { InsertContainer } from "./-components/InsertContainer.tsx";

export const Route = createFileRoute("/")({
  component: Index
});

const sortItem = [
  { text: "排序: 作者名稱", value: "Author_Main(Author)" },
  { text: "排序: 攤位名稱", value: "Booth_name" },
  { text: "排序: 攤位位置 Day 01", value: "Location_Day01" },
  { text: "排序: 攤位位置 Day 02", value: "Location_Day02" },
  { text: "排序: 攤位位置 Day 03", value: "Location_Day03" }
];

function Index() {
  console.log("Hello From Index");
  return <IndexWrapper>
    <DataOperationProvider>
      <ContainerWrapper>
        <SearchContainer />
        <FilterContainer sortItem={sortItem} />
        <InsertContainer/>
      </ContainerWrapper>
    </DataOperationProvider>
  </IndexWrapper>;
}

const ContainerWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "1.5rem"
});

const IndexWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "2rem",
});
