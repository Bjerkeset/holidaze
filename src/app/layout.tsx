import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Raleway } from "next/font/google";

import "../styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils/utils";

// const inter = Inter({ subsets: ["latin"] });
const inter = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Holidaze - Your holiday booking site",
  description: "Book your holiday with Holidaze",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "w-screen h-screen bg-background")}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
