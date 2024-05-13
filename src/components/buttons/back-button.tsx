"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { BsArrowLeft } from "react-icons/bs";

type Props = {
  goToHome?: boolean;
};

export default function BackButton({ goToHome }: Props) {
  const router = useRouter();
  const handleClick = () => {
    if (goToHome) {
      router.push("/");
    }
    router.back();
  };

  return (
    <Button variant={"link"} className="p-0 " onClick={handleClick}>
      <BsArrowLeft className="text-3xl" />
    </Button>
  );
}
