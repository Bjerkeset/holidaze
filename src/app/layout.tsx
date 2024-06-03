import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Raleway } from "next/font/google";

import "../styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils/utils";

const inter = Raleway({ subsets: ["latin"] });

export const metadata = {
  title: "Holidaze - Your holiday booking site",
  description: "Book your holiday with Holidaze",
  keywords: ["Booking", "Travel", "Accomodation", "Exam"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          "min-w-screen min-h-screen bg-background pb-[200px]"
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
