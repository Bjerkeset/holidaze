import CustomFeed from "@/components/feeds/custom-feed";
import {
  fetchAllVenues,
  fetchAllVenuesInEurope,
} from "@/lib/server/api/api.action";
import VenueMap from "@/components/map/venue-map";
import {
  formatDate,
  sortVenuesByCreationDate,
  sortVenuesByRating,
  transformVenuesToCommands,
} from "@/lib/utils/utils";
import Map from "@/components/map/map";
import { FancyMultiSelect } from "@/components/widgets/search-test";
import CommandSearch from "@/components/widgets/search";
import LatestFeed from "@/components/feeds/latest-feed";
import FeaturedFeed from "@/components/feeds/featured-feed";
import { SortButtonGroup } from "@/components/buttons/sort-button-group";
import { MetaType, SearchParamsType, VenueType } from "@/lib/validation/types";
import PaginationButtonGroup from "@/components/buttons/pagination-button-group";

type Props = {
  searchParams: SearchParamsType;
};

export default async function Home({ searchParams }: Props) {
  let venues: VenueType[] = [];
  let sortedVenuesEurope: VenueType[] = [];
  let latestVenuesEurope: VenueType[] = [];
  let metadata: MetaType = {
    isFirstPage: true,
    isLastPage: true,
    currentPage: 1,
    previousPage: null,
    nextPage: null,
    pageCount: 1,
    totalCount: 0,
  };

  // Fetch venues in Europe
  const {
    data: venuesEurope,
    error: venuesError,
    meta: venuesEuropeMetadata,
  } = await fetchAllVenuesInEurope();

  if (venuesError || !venuesEurope) {
    return <div>No venues found</div>;
  }

  // Fetch all venues without a specified location if needed
  if (
    searchParams.sort === "all-latest" ||
    searchParams.sort === "all-popular"
  ) {
    const sortQuery =
      searchParams.sort === "all-popular" ? "rating" : "created";
    const {
      data: allVenues,
      error: allVenuesError,
      meta: allVenuesMetadata,
    } = await fetchAllVenues({
      page: searchParams.page,
      sort: sortQuery,
    });
    if (allVenuesError || !allVenues) {
      return <div>No venues found</div>;
    }
    venues = allVenues;
    metadata = allVenuesMetadata || metadata;
  } else {
    venues = venuesEurope;
    metadata = venuesEuropeMetadata || metadata;
  }

  // Sort venues in Europe
  sortedVenuesEurope = sortVenuesByRating(venuesEurope);
  latestVenuesEurope = sortVenuesByCreationDate(venuesEurope);

  // Determine sorted venues based on searchParams
  let sortedVenues;
  if (searchParams.sort === "europe-popular") {
    sortedVenues = sortedVenuesEurope;
  } else if (searchParams.sort === "all-latest") {
    sortedVenues = sortVenuesByCreationDate(venues);
  } else if (searchParams.sort === "all-popular") {
    sortedVenues = sortVenuesByRating(venues);
  } else {
    // Default to latest venues in Europe
    sortedVenues = latestVenuesEurope;
  }
  // Log venue name and id
  // console.log(
  //   "all venues",
  //   sortedVenues.map((venue) => ({
  //     name: venue.name,
  //     rating: venue.rating,
  //     created: formatDate(venue.created),
  //   }))
  // );
  // Create a list for the location search.
  const commands = transformVenuesToCommands(venuesEurope || []);

  return (
    <div className="flex flex-col items-center gap-10  ">
      <div className="relative w-screen h-[40vh]">
        <Map data={venuesEurope} />
        <div className="absolute bottom-5 mx-auto w-full flex justify-center">
          <CommandSearch searchParams={searchParams} commands={commands} />
        </div>
      </div>
      <FeaturedFeed venues={sortedVenuesEurope} />
      <LatestFeed
        searchParams={searchParams}
        count={metadata.totalCount}
        venues={sortedVenues}
      />
      {searchParams.sort === "all-latest" ||
      searchParams.sort === "all-popular" ? (
        <PaginationButtonGroup
          metadata={metadata}
          searchParams={searchParams}
        />
      ) : null}
    </div>
  );
}
