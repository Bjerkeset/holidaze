import { Heart } from "lucide-react";
import BackButton from "../buttons/back-button";
import { IoMdHeart } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";
import { cookies } from "next/headers";

type Props = {};

export default function TopbarVenue({}: Props) {
  return (
    <div className="absolute w-full top-0 z-10">
      <nav className="w-full flex justify-between items-center px-4 py-2">
        <BackButton />
      </nav>
    </div>
  );
}
