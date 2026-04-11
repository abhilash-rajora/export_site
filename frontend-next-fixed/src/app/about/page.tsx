import type { Metadata } from "next";
import PublicLayout from "@/layouts/PublicLayout";
import AboutPage from "@/components/pages/AboutPage";

export const metadata: Metadata = {
  title: "About Us | WExports",
  description: "Learn about WExports — India's trusted global export partner with 15+ years of experience serving 50+ countries.",
  alternates: { canonical: "https://wexports.vercel.app/about" },
};

export default function Page() {
  return (
    <PublicLayout>
      <AboutPage />
    </PublicLayout>
  );
}
