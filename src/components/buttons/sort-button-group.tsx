"use client";

import { SearchParamsType } from "@/lib/validation/types";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils/utils";
import ResetButton from "./reset-button";

type Props = {
  searchParams: SearchParamsType;
};

export function SortButtonGroup({ searchParams }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sortParams = searchParams.sort;

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const buttonId = event.currentTarget.id;
    const query = new URLSearchParams();
    if (searchParams.search) {
      query.set("search", searchParams.search);
    }
    query.set("sort", buttonId);

    router.replace(`${pathname}?${query.toString()}`, { scroll: false });
  }

  return (
    <div className="flex gap-2 border rounded-md p-1 flex-wrap justify-between md:justify-start md:gap-4">
      <div className="space-y-2 md:border-r pr-4">
        <h2 className="text-sm text-center border-b font-semibold">
          Venues in Europe
        </h2>
        <div className="flex gap-2 flex-col sm:flex-row">
          <Button
            className={cn(
              (!sortParams || sortParams === "europe-latest") &&
                "hover:bg-primary/50 bg-primary/20"
            )}
            id="europe-latest"
            onClick={handleClick}
            variant={"outline"}
            size={"sm"}
          >
            Latest in Europe
          </Button>
          <Button
            className={cn(
              sortParams === "europe-popular" &&
                "hover:bg-primary/50 bg-primary/20"
            )}
            id="europe-popular"
            onClick={handleClick}
            variant={"outline"}
            size={"sm"}
          >
            Popular in Europe
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-sm text-center border-b font-semibold">
          Anywhere / All
        </h2>

        <div className="flex gap-2 flex-col sm:flex-row">
          <Button
            className={cn(
              sortParams === "all-latest" && "hover:bg-primary/50 bg-primary/20"
            )}
            id="all-latest"
            onClick={handleClick}
            variant={"outline"}
            size={"sm"}
          >
            Latest
          </Button>
          <Button
            className={cn(
              sortParams === "all-popular" &&
                "hover:bg-primary/50 bg-primary/20"
            )}
            id="all-popular"
            onClick={handleClick}
            variant={"outline"}
            size={"sm"}
          >
            Popular
          </Button>
        </div>
      </div>
      {(searchParams.page || searchParams.search || searchParams.sort) && (
        <ResetButton className={"my-auto ml-auto"} />
      )}
    </div>
  );
}
