import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VenueType } from "@/lib/validation/types";
import { Button } from "../ui/button";
import VenueCard from "../cards/venue-card-sm";
import ProfileAvatar from "../widgets/profile-avatar";

type Props = {
  venue: VenueType;
};
export default function MarkerDropdown({ venue }: Props) {
  return (
    <>
      <div className="relative">
        <VenueCard venue={venue} />
        <div className="absolute top-3 left-3">
          <div className="flex border border-gray-400 rounded-md bg-secondary/50 relative z-20 px-2">
            {venue.owner && (
              <ProfileAvatar className="z-50" noClick profile={venue.owner} />
            )}
            <div className="absolute -inset-1 rounded-md blur-md bg-gradient-to-br from-gray-500 via-white/50 to-gray-500 z-10"></div>
          </div>
        </div>
      </div>
    </>
  );
}
