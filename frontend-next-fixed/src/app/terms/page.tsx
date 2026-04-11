import type { Metadata } from "next";
import PublicLayout from "@/layouts/PublicLayout";
import TermsPage from "@/components/pages/TermsPage";

export const metadata: Metadata = {
  title: "Terms & Conditions | WExports",
  description: "Read WExports terms and conditions for using our platform and services.",
  alternates: { canonical: "https://wexports.vercel.app/terms" },
};

export default function Page() {
  return (
    <PublicLayout>
      <TermsPage />
    </PublicLayout>
  );
}
