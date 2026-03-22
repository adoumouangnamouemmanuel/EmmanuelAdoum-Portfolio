import BlogLayout from "@/components/layout/BlogLayout";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <BlogLayout>{children}</BlogLayout>;
}
