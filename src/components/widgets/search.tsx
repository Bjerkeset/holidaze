"use client";
import { useState, useEffect, useRef } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "../ui/command";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/utils";
import { SearchParamsType } from "@/lib/validation/types";
import { Button } from "../ui/button";
import ResetButton from "../buttons/reset-button";

type commandType = {
  commands: { value: string; label: string }[];
  className?: string;
  searchParams: SearchParamsType;
};

export default function CommandSearch({
  commands,
  className,
  searchParams,
}: commandType) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(searchParams.search || "");
  const router = useRouter();
  const pathname = usePathname();
  const commandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        commandRef.current &&
        !commandRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [commandRef]);

  const handleValueChange = (value: string) => {
    setInputValue(value);
    setOpen(!!value);
  };

  const handleSelect = (value: string) => {
    console.log("Selected command:", value);
    const decodedValue = decodeURIComponent(value);
    setInputValue(decodedValue);
    setOpen(false);
    console.log("pathname", pathname);

    const query = new URLSearchParams();
    if (decodedValue) {
      query.set("search", decodedValue);
    }
    if (searchParams.sort) {
      query.set("sort", searchParams.sort);
    }

    router.replace(`${pathname}?${query.toString()}`, { scroll: false });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      setOpen(true);
    }
  };

  const filteredCommands = Array.isArray(commands)
    ? commands.filter((command) =>
        command.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    : [];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div ref={commandRef} className="relative w-full ">
        <Command className={cn("rounded-lg border shadow-md w-full space-y-1")}>
          <CommandInput
            placeholder="Search by address..."
            value={inputValue}
            onValueChange={handleValueChange}
            onKeyDown={handleKeyDown}
            className="h-8 "
          />
          {
            <CommandList className="absolute top-10 bg-background w-full rounded-md shadow z-50 ">
              {open &&
                filteredCommands.length > 0 &&
                filteredCommands.map((command) => (
                  <CommandItem
                    key={command.value}
                    value={command.value}
                    onSelect={() => handleSelect(command.value)}
                  >
                    {command.label}
                  </CommandItem>
                ))}
            </CommandList>
          }
        </Command>
      </div>
      {searchParams.search && <ResetButton className="" />}
    </div>
  );
}
