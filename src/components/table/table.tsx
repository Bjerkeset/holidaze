// Table.tsx
import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

export const metadata: Metadata = {
  title: "Venues",
  description: "A list of venues displayed using Tanstack Table.",
};

export default async function Table(data: any) {
  const venues = data.data;

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Venues</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of all your venues.
            </p>
          </div>
        </div>
        <DataTable data={venues} columns={columns} />
      </div>
    </>
  );
}
