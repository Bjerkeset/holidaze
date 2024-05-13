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
  return <main className="w-screen h-screen bg-background">{children}</main>;
}
