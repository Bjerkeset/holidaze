// columns.ts
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Venue } from "../data/schema"; // Import the Venue type
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { labels } from "../data/data"; // Assuming you have some predefined labels

export const columns: ColumnDef<Venue>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      const formattedId = `${id.slice(0, 2)}...${id.slice(-2)}`;
      return <div className="w-[80px]">{formattedId}</div>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate font-medium">
        {row.getValue("name")}
      </span>
    ),
    filterFn: "includesString",
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => <span>${row.getValue("price")}</span>,
    filterFn: "equals",
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "maxGuests",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Max Guests" />
    ),
    cell: ({ row }) => <span>{row.getValue("maxGuests")}</span>,
    filterFn: "equals",
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "bookings",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bookings" />
    ),
    cell: ({ row }) => {
      const bookings = row.getValue("bookings") as Array<unknown>;
      return <span>{bookings.length}</span>;
    },
    filterFn: "equals",
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
