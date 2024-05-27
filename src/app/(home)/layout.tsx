import Bottombar from "@/components/widgets/bottombar";
import Footer from "@/components/widgets/footer";
import Topbar from "@/components/widgets/topbar";
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
      <Topbar />
      {children}
      <Bottombar />
      <Footer />
    </main>
  );
}
