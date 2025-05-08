"use client";

import AdminDashboard from "@/components/admin/AdminDashboard";
import { SessionProvider } from "next-auth/react";

function AdminContent() {
  return <AdminDashboard />;
}

export default function AdminClient({ user }: { user: any }) {
  return (
    <SessionProvider>
      <AdminContent />
    </SessionProvider>
  );
}