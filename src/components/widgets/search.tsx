"use client";
import { useState } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "../ui/command";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

type commandType = {
  commands: { value: string; label: string }[];
};

export default function CommandSearch({ commands }: commandType) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const handleValueChange = (value: string) => {
    setInputValue(value);
    setOpen(!!value);
  };

  const handleSelect = (value: string) => {
    console.log("Selected command:", value);
    setInputValue(value);
    setOpen(false);
    console.log("pathname", pathname);
    router.replace(pathname + `?search=${value}`);
  };

  const filteredCommands = Array.isArray(commands)
    ? commands.filter((command) =>
        command.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    : [];

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput
        placeholder="Type to search..."
        value={inputValue}
        onValueChange={handleValueChange}
        // onSelect={() => handleSelect(inputValue)}
      />
      {
        <CommandList>
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
  );
}
