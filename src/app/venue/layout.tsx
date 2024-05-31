import TopbarVenue from "@/components/widgets/topbar-venue";
import type { Metadata } from "next";
import Head from "next/head";
// import { sss } from "../../../public/removed-logo-cropped.png";

// export const metadata: Metadata = {
//   title: "Holidaze - Your holiday booking site",
//   description: "Book your holiday with Holidaze",
// };

export const metadata = {
  title: "Holidaze - Your holiday booking site",
  description: "Book your holiday with Holidaze",
  keywords: ["Booking", "Travel", "Accomodation", "Exam", ""],
  authors: [
    {
      name: "bjerkeset",
    },
  ],
  creator: "B. Bjerkeset",

  icons: {
    icon: "/logo-sized-original.png",
  },
};

export default function VenueLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="flex flex-col items-center w-screen h-screen max-w-screen-2xl mx-auto">
        <TopbarVenue />
        {children}
      </main>
    </>
  );
}
