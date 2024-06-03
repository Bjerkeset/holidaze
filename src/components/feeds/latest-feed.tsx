import { SortButtonGroup } from "../buttons/sort-button-group";
import VenuesGrid from "./venues-grid";
import { SearchParamsType, VenueType } from "@/lib/validation/types";

type Props = {
  venues: VenueType[];
  searchParams: SearchParamsType;
  count?: number;
  isHomepage?: boolean;
};

export default function LatestFeed({
  venues,
  searchParams,
  count,
  isHomepage,
}: Props) {
  return (
    <div>
      <div className="px-6 py-4">
        <div className="flex gap-1 items-center justify-between">
          <h2 className="text-2xl font-bold ">Venues</h2>
          <p>
            <span> {venues.length} </span>
            <span className="text-muted-foreground text-sm">/{count} </span>
          </p>
        </div>

        <SortButtonGroup searchParams={searchParams} />
      </div>
      <VenuesGrid venues={venues} isHomepage={isHomepage} />
    </div>
  );
}
