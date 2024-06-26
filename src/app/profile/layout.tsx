import Bottombar from "@/components/widgets/bottombar";
import Topbar from "@/components/widgets/topbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Holidaze - Profile",
  description: "Profile page.",
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Topbar />
      <main className="flex flex-col items-center min-w-screen bg-background min-h-screen p-2">
        {children}
      </main>
      <Bottombar />
    </>
  );
}
