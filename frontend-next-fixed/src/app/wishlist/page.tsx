import type { Metadata } from "next";
import PublicLayout from "@/layouts/PublicLayout";
import WishlistPage from "@/components/pages/WishlistPage";

export const metadata: Metadata = {
  title: "Wishlist | WExports",
  description: "View your saved products on WExports.",
  robots: { index: false },
};

export default function Page() {
  return (
    <PublicLayout>
      <WishlistPage />
    </PublicLayout>
  );
}
