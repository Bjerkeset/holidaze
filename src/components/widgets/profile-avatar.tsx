import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils/utils";
import { CustomerType, ProfileType } from "@/lib/validation/types";
import { cookies } from "next/headers";

type Props = {
  profile: ProfileType | CustomerType;
  willFit?: boolean;
  className?: string;
  noClick?: boolean;
  isOwner?: boolean;
};

export default function ProfileAvatar({
  profile,
  willFit,
  className,
  noClick,
  isOwner,
}: Props) {
  const { avatar, name } = profile;

  const profileLink = isOwner ? "/profile" : `/profile/${name}`;

  if (noClick) {
    return (
      <div className={cn("flex gap-1 ", className)}>
        <Avatar className="h-8 w-8 hidden md:block">
          <AvatarImage src={avatar.url} alt={avatar.alt} />
          <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <p className={cn("px-1 hidden my-auto font-medium text-sm md:block")}>
          {name}
        </p>
      </div>
    );
  }

  // Conditionally render the name tag based on screen width.
  if (willFit) {
    return (
      <div className={cn("w-full flex items-center", className)}>
        <Link className="md:hidden" href={profileLink}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatar.url} alt={avatar.alt} />
            <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </Link>
        <>
          <Avatar className="h-8 w-8 hidden md:block">
            <AvatarImage src={avatar.url} alt={avatar.alt} />
            <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <Link
            href={profileLink}
            className={cn(
              buttonVariants({ variant: "link" }),
              "px-1 hidden md:block"
            )}
          >
            {name}
          </Link>
        </>
      </div>
    );
  }

  return (
    <div className={cn("w-full flex items-center", className)}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatar.url} alt={avatar.alt} />
        <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <Link
        href={profileLink}
        className={cn(buttonVariants({ variant: "link" }), "px-1")}
      >
        {name}
      </Link>
    </div>
  );
}
