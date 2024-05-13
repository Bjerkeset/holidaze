import { Button } from "../ui/button";

type Props = {};

export default function BookButtonGroup({}: Props) {
  return (
    <div className="flex fixed bottom-0 w-full items-center border-t p-2 justify-between bg-background">
      <p>$255 / night</p>
      <Button size={"lg"}>Book Now</Button>
    </div>
  );
}
