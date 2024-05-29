"use client";
import { MetaType, SearchParamsType } from "@/lib/validation/types";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils/utils";

type Props = {
  metadata: MetaType;
  searchParams: SearchParamsType;
};

export default function PaginationButtonGroup({
  metadata,
  searchParams,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const buttonId = event.currentTarget.id;
    const query = new URLSearchParams();
    if (searchParams.search) {
      query.set("search", searchParams.search);
    }
    if (searchParams.sort) {
      query.set("sort", searchParams.sort);
    }

    query.set("page", buttonId);
    router.replace(`${pathname}?${query.toString()}`, { scroll: false });
  }

  const pageCount = metadata.pageCount || 1; // Ensure pageCount is defined
  const currentPage = metadata.currentPage ?? 1; // Ensure currentPage is defined
  const pageButtons = [];

  const range = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  };

  const getPageNumbers = () => {
    const delta = 2;
    const left = currentPage - delta;
    const right = currentPage + delta;
    let rangeWithEllipsis = [];

    if (left > 1) {
      rangeWithEllipsis.push(1);
      if (left > 2) {
        rangeWithEllipsis.push("...");
      }
    }

    const middleRange = range(Math.max(left, 1), Math.min(right, pageCount));
    rangeWithEllipsis = rangeWithEllipsis.concat(middleRange);

    if (right < pageCount) {
      if (right < pageCount - 1) {
        rangeWithEllipsis.push("...");
      }
      rangeWithEllipsis.push(pageCount);
    }

    return rangeWithEllipsis;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex gap-2 pb-6">
      <Button
        disabled={metadata.isFirstPage}
        id={(currentPage - 1).toString()}
        onClick={handleClick}
        variant={"outline"}
        size={"sm"}
      >
        Previous
      </Button>
      {pages.map((page, index) =>
        page === "..." ? (
          <span key={index} className="px-2">
            ...
          </span>
        ) : (
          <Button
            key={index}
            id={page.toString()}
            onClick={handleClick}
            variant={currentPage === page ? "default" : "outline"}
            size={"sm"}
          >
            {page}
          </Button>
        )
      )}
      <Button
        disabled={metadata.isLastPage}
        id={(currentPage + 1).toString()}
        onClick={handleClick}
        variant={"outline"}
        size={"sm"}
      >
        Next
      </Button>
    </div>
  );
}
