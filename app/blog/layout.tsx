import type { ReactNode } from "react";

// No Footer import - we'll let the main layout handle the footer

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
