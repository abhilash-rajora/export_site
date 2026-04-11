import type { Metadata } from "next";
import PublicLayout from "@/layouts/PublicLayout";
import ProductDetailPage from "@/components/pages/ProductDetailPage";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${process.env.API_URL}/products/${id}`, { cache: "no-store" });
    if (!res.ok) return { title: "Product | WExports" };
    const product = await res.json();
    const desc = product.description?.split('\n')[0]?.slice(0, 155) ?? '';
    return {
      title: `${product.name} | ${product.category} Export India | WExports`,
      description: desc ? `${desc} — Verified Indian exporter. Free quote within 24hrs.` : 'Quality export product from India.',
      openGraph: {
        title: `${product.name} | WExports`,
        description: desc,
        images: product.images?.[0] ? [product.images[0]] : product.imageUrl ? [product.imageUrl] : [],
      },
      alternates: { canonical: `https://wexports.vercel.app/products/detail/${id}` },
    };
  } catch {
    return { title: "Product | WExports" };
  }
}

export default function Page() {
  return (
    <PublicLayout>
      <ProductDetailPage />
    </PublicLayout>
  );
}
