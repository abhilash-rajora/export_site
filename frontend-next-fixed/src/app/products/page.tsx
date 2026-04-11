import type { Metadata } from "next";
import PublicLayout from "@/layouts/PublicLayout";
import ProductsPage from "@/components/pages/ProductsPage";

export const metadata: Metadata = {
  title: "Export Products from India | WExports",
  description: "Explore WExports full catalog — Agriculture, Textiles, Minerals, Electronics, Food & Beverages, Handicrafts and more.",
  alternates: { canonical: "https://wexports.vercel.app/products" },
};

export default function Page() {
  return (
    <PublicLayout>
      <ProductsPage />
    </PublicLayout>
  );
}
