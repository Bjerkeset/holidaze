import TopbarVenue from "@/components/widgets/topbar-venue";
import type { Metadata } from "next";
import Head from "next/head";
// import { sss } from "../../../public/removed-logo-cropped.png";

export const metadata: Metadata = {
  title: "Holidaze - Venue",
  description: "Book your holiday with Holidaze",
};

export default function VenueLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col items-center w-screen h-screen max-w-screen-xl mx-auto">
      <TopbarVenue />
      {children}
    </main>
  );
}
