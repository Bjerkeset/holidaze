import TopbarVenue from "@/components/widgets/topbar-venue";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Holidaze - Your holiday booking site",
  description: "Book your holiday with Holidaze",
};

export default function VenueLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-screen h-screen bg-background">
      <TopbarVenue />
      {children}
    </main>
  );
}
