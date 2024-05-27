import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CiCalendar } from "react-icons/ci";
import EditUserForm from "../forms/edit-user-form";
import { ProfileType } from "@/lib/validation/types";
import { cn } from "@/lib/utils/utils";
import ProfileAvatar from "@/components/widgets/profile-avatar";
import { MdOutlineEmail } from "react-icons/md";
import Image from "next/image";
import StatisticsCard from "./statistics-card";
import { Badge } from "../ui/badge";
import { GrUserManager } from "react-icons/gr";
import { Home } from "lucide-react";
import { Button } from "../ui/button";

type Props = {
  user: ProfileType;
  isMini?: boolean;
  isOwner: boolean;
};

export default function ProfileCard({ user, isMini, isOwner }: Props) {
  // console.log("user", user);
  console.log("Is Owner----", isOwner);
  if (isMini) {
    return (
      <Card className={cn(" w-full border-none ")}>
        <CardHeader className="flex-row justify-between">
          {/* <ProfileAvatarClient preFetchedUser={user} isProfileCard /> */}
        </CardHeader>
        <CardContent className="flex flex-col py-4 border-t">
          <div className="flex flex-col gap-4">
            <Badge className="flex gap-2 items-center h-6">
              <MdOutlineEmail />
              {user.email}
            </Badge>
            <Badge className="flex gap-2 items-center h-6">
              <GrUserManager />
              Venue Manager
            </Badge>
          </div>
          {/* <UserStatistics user={user} isMini={isMini} /> */}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-none overflow-hidden border-none">
      <CardHeader className="flex flex-row justify-between items-end relative bg-none min-h-[25vh]">
        {user.banner.url && (
          <Image
            src={user.banner.url}
            alt="Cover Image"
            fill
            className="absolute top-0 left-0 z-0 w-full h-full object-cover"
          />
        )}
        <div className="relative">
          <div className="flex border border-gray-400 rounded-md bg-secondary/50 relative z-20 px-2">
            <ProfileAvatar className="z-50" noClick profile={user} />
            <div className="absolute -inset-1 rounded-md blur-md bg-gradient-to-br from-gray-500 via-white/50 to-gray-500 z-10"></div>
          </div>
        </div>
        <div className="z-50">{isOwner && <EditUserForm user={user} />}</div>
      </CardHeader>
      <CardContent className="flex py-4 gap-6 border-t flex-col md:flex-row">
        <div className="flex flex-col gap-3">
          <Badge className="flex gap-2 items-center h-6">
            <MdOutlineEmail className=" text-sm" />
            {user.email}
          </Badge>
          <UserDetails isOwner={isOwner} user={user} />
        </div>
        <p className="text-muted-foreground leading-7 text-pretty ">
          {user.bio === null ? "No bio" : user.bio}
        </p>
      </CardContent>
      <CardFooter className="flex justify-center"></CardFooter>
    </Card>
  );
}

function UserDetails({
  user,
  isOwner,
}: {
  user: ProfileType;
  isOwner: boolean;
}) {
  if (!user.venueManager) {
    return (
      <>
        <Badge className="flex gap-2 items-center h-6">
          <GrUserManager className=" text-sm" />
          Customer
        </Badge>

        {isOwner && (
          <>
            <StatisticsCard
              title={"Bookings"}
              value={user._count.bookings}
              description={""}
              icon={<Home className="h-4 w-4 text-muted-foreground" />}
            />
            <Button size={"sm"}>View Bookings</Button>
          </>
        )}
      </>
    );
  } else {
    return (
      <>
        <Badge className="flex gap-2 items-center h-6">
          <GrUserManager className=" text-sm" />
          Venue Manager
        </Badge>
        <StatisticsCard
          title={"Venues"}
          value={user._count.venues}
          description={""}
          icon={<Home className="h-4 w-4 text-muted-foreground" />}
        />
      </>
    );
  }
}
