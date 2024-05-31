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
      <div className="h-full">
        <VenueCard venue={venue} />
      </div>
    </>
  );
}
