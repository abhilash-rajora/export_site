import type { Metadata } from "next";
import PublicLayout from "@/layouts/PublicLayout";
import ProductsPage from "@/components/pages/ProductsPage";

const CATEGORY_LABELS: Record<string, string> = {
  agriculture: 'Agriculture', textiles: 'Textiles', minerals: 'Minerals',
  electronics: 'Electronics', 'food-beverages': 'Food & Beverages', handicrafts: 'Handicrafts',
};

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const label = CATEGORY_LABELS[category] ?? category;
  return {
    title: `${label} Export Products from India | WExports`,
    description: `Buy premium ${label} products exported from India. Verified supplier, competitive pricing, global delivery.`,
    alternates: { canonical: `https://wexports.vercel.app/products/${category}` },
  };
}

export default function Page() {
  return (
    <PublicLayout>
      <ProductsPage />
    </PublicLayout>
  );
}
