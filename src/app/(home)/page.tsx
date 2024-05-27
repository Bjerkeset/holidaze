import CustomFeed from "@/components/feeds/custom-feed";
import { fetchAllVenuesInEurope } from "@/lib/server/api/api.action";
import VenueMap from "@/components/map/venue-map";
import CommandSearch from "@/components/widgets/search";
import { transformVenuesToCommands } from "@/lib/utils/utils";

export default async function Home() {
  const { data: venues, error: venuesError } = await fetchAllVenuesInEurope();

  if (venuesError || !venues) {
    return <div>No venues found</div>;
  }
  const commands = transformVenuesToCommands(venues || []);
  return (
    <div className="flex  flex-col items-center gap-10 h-screen bg-slate-100">
      <div className="w-full bg-green-100 max-w-screen-xl overflow-hidden">
        <VenueMap venues={venues} />
      </div>
      <CommandSearch commands={commands} />

      {/* <div className="w-full max-w-screen-xl flex flex-col gap-10"> */}
      <CustomFeed venues={venues} title={"Suggestions"} />
      {/* </div> */}
    </div>
  );
}
