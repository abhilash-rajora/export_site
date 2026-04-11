import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicLayout from "@/layouts/PublicLayout";
import BlogDetailPage from "@/components/pages/BlogDetailPage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${process.env.API_URL}/blogs/${slug}`, { cache: "no-store" });
    if (!res.ok) return { title: "Blog | WExports" };
    const data = await res.json();
    const blog = data?.blog;
    return {
      title: blog ? `${blog.title} | WExports Blog` : "Blog | WExports",
      description: blog?.excerpt || "Read export insights from WExports.",
      openGraph: {
        title: blog?.title,
        description: blog?.excerpt,
        images: blog?.coverImage ? [blog.coverImage] : [],
      },
      alternates: { canonical: `https://wexports.vercel.app/blog/${slug}` },
    };
  } catch {
    return { title: "Blog | WExports" };
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return notFound();
  let data = null;
  try {
    const res = await fetch(`${process.env.API_URL}/blogs/${slug}`, { cache: "no-store" });
    if (!res.ok) return notFound();
    data = await res.json();
  } catch {
    return notFound();
  }
  return (
    <PublicLayout>
      <BlogDetailPage initialData={data} slug={slug} />
    </PublicLayout>
  );
}
