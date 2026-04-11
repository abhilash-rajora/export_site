"use client";

import { AuthProvider } from "@/hooks/useAuth";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </ReactQueryProvider>
  );
}