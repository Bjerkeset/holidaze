import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Holidaze - Bookings",
  description: "Summery of your orders.",
};

export default function BookingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="w-screen h-screen bg-background">{children}</main>;
}
