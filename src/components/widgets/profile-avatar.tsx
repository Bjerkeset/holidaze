import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils/utils";
import { CustomerType, ProfileType } from "@/lib/validation/types";

type Props = {
  profile: ProfileType | CustomerType;
  noName?: boolean;
  className?: string;
  noClick?: boolean;
};

export default function ProfileAvatar({
  profile,
  noName,
  className,
  noClick,
}: Props) {
  const { avatar, name } = profile;

  return (
    <div className={cn("w-full flex items-center", className)}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatar.url} alt={avatar.alt} />
        <AvatarFallback>HZ</AvatarFallback>
      </Avatar>
      {!noName && (
        <Link
          href={"/profile"}
          className={cn(buttonVariants({ variant: "link" }), "px-1", {
            "hover:no-underline pointer-events-none": noClick,
          })}
        >
          {name}
        </Link>
      )}
    </div>
  );
}
