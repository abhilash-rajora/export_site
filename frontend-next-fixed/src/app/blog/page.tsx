import type { Metadata } from "next";
import PublicLayout from "@/layouts/PublicLayout";
import BlogPage from "@/components/pages/BlogPage";

export const metadata: Metadata = {
  title: "Blog | Export Insights & Trade Tips | WExports",
  description: "Stay updated with the latest export tips, industry news and market trends from WExports.",
  keywords: ["export blog india", "trade insights", "export tips", "wexports blog"],
  alternates: { canonical: "https://wexports.vercel.app/blog" },
};

export default function Page() {
  return (
    <PublicLayout>
      <BlogPage />
    </PublicLayout>
  );
}
