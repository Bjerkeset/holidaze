import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import Bottombar from "@/components/widgets/bottombar";
import Topbar from "@/components/widgets/topbar";
import { cn } from "@/lib/utils/utils";
import Footer from "@/components/widgets/footer";

const inter = Inter({ subsets: ["latin"] });

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
