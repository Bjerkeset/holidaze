import CustomFeed from "@/components/feeds/custom-feed";
import FeaturedFeed from "@/components/feeds/featured-feed";
import LatestFeed from "@/components/feeds/latest-feed";
import { fetchAllVenues } from "@/lib/server/api/api.action";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default async function Home() {
  const venuesResponse = await fetchAllVenues();

  if (!venuesResponse.data) {
    console.error("No data available");
    return <div>No data available</div>;
  }

  return (
    <div className="flex justify-center flex-col items-center gap-10 h-full">
      {/* <FeaturedFeed venues={venuesResponse.data} /> */}
      {/* <LatestFeed venues={venuesResponse.data} /> */}
      <ResizablePanelGroup
        direction="vertical"
        className="h-full max-w-md rounded-lg border"
      >
        <ResizablePanel defaultSize={25}>header</ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <CustomFeed venues={venuesResponse.data} title={"Recomened"} />
          <CustomFeed venues={venuesResponse.data} isSmall title={"Latest"} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
