import BackButton from "@/components/buttons/back-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiDotsVertical } from "react-icons/hi";

export default function BookingsPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <nav>
        <ul className="w-full flex justify-between p-4   items-center">
          <li>
            <BackButton />
          </li>
          <li>Order #{"4444"}</li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <HiDotsVertical className="text-lg" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </nav>
    </div>
  );
}
