import Bottombar from "@/components/widgets/bottombar";
import Topbar from "@/components/widgets/topbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Holidaze - dashboard",
  description: "dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Topbar />
      <main className="flex flex-col items-center min-w-screen bg-background min-h-screen border-t pt-2 pb-16">
        {children}
      </main>
      <Bottombar />
    </>
  );
}
