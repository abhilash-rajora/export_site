import HomeClient from "@/components/pages/HomeClient";
import PublicLayout from "@/layouts/PublicLayout";

async function getData() {
  try {
    const res = await fetch(`${process.env.API_URL}/products/homepage`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return { featured: [], newArrivals: [], trending: [] };
    return res.json();
  } catch {
    return { featured: [], newArrivals: [], trending: [] };
  }
}

export default async function Page() {
  const data = await getData();
  return (
    <PublicLayout>
      <HomeClient initialData={data} />
    </PublicLayout>
  );
}
