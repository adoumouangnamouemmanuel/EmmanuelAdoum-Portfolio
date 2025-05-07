import type { Metadata } from "next";
import { metadata as sharedMetadata } from "@/app/metadata"; // Import shared metadata
export const metadata = sharedMetadata; // Export metadata for Next.js to use

export default function ServerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}