import type { ReactNode } from "react";
import BlogLayout from "@/components/layout/BlogLayout";

export default function Layout({ children }: { children: ReactNode }) {
  return <BlogLayout>{children}</BlogLayout>;
}
