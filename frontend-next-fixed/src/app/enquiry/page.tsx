import type { Metadata } from "next";
import PublicLayout from "@/layouts/PublicLayout";
import EnquiryPage from "@/components/pages/EnquiryPage";

export const metadata: Metadata = {
  title: "Contact & Enquiry | WExports",
  description: "Send us an enquiry for any product. Our team responds within 24 hours.",
  alternates: { canonical: "https://wexports.vercel.app/enquiry" },
};

export default function Page() {
  return (
    <PublicLayout>
      <EnquiryPage />
    </PublicLayout>
  );
}
