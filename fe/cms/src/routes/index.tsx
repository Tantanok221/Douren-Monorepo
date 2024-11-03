import { createFileRoute } from "@tanstack/react-router";
import { DataOperationProvider, FilterContainer, SearchContainer, TagFilterContextProvider } from "@lib/ui";
import { InsertContainer } from "./-components/InsertContainer.tsx";
import { ArtistContainer } from "./-components/ArtistContainer.tsx";

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
  return <div className={"flex flex-col w-full gap-8"}>
    <DataOperationProvider>
        <div className={"flex flex-col w-full gap-6"}>
          <SearchContainer />
          <FilterContainer sortItem={sortItem} />
          <InsertContainer />
        </div>
        <div>
          <ArtistContainer />
        </div>
    </DataOperationProvider>
  </div>;
}
