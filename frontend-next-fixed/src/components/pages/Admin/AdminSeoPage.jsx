'use client';
import { useState, useEffect } from "react";
import api from '@/api/axios';
import { toast } from 'sonner';

export default function AdminSeoPage() {
  const [form, setForm] = useState({
    page: "home",
    title: "",
    description: "",
    keywords: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch SEO data whenever selected page changes
  useEffect(() => {
    const fetchSeo = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/seo/${form.page}`);
        if (res.data) {
          setForm((prev) => ({
            ...prev,
            title: res.data.title || "",
            description: res.data.description || "",
            keywords: res.data.keywords || "",
          }));
        } else {
          // Clear fields if no SEO data exists for this page
          setForm((prev) => ({ ...prev, title: "", description: "", keywords: "" }));
        }
      } catch {
        setForm((prev) => ({ ...prev, title: "", description: "", keywords: "" }));
      } finally {
        setLoading(false);
      }
    };

    fetchSeo();
  }, [form.page]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/seo", form);
    toast.success("SEO Updated Successfully");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">SEO Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ✅ Added Terms & Conditions option */}
        <select
          name="page"
          value={form.page}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="home">Home</option>
          <option value="about">About</option>
          <option value="products">Products</option>
          <option value="terms">Terms & Conditions</option>
        </select>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading SEO data...</p>
        ) : (
          <>
            {/* ✅ value={form.title} ensures pre-filled data shows */}
            <input
              type="text"
              name="title"
              placeholder="Meta Title"
              value={form.title}
              onChange={handleChange}
              className="border p-2 w-full"
            />

            <textarea
              name="description"
              placeholder="Meta Description"
              value={form.description}
              onChange={handleChange}
              className="border p-2 w-full"
            />

            <input
              type="text"
              name="keywords"
              placeholder="Keywords (comma separated)"
              value={form.keywords}
              onChange={handleChange}
              className="border p-2 w-full"
            />

            <button type="submit" className="bg-gold-400 px-4 py-2">
              Save
            </button>
          </>
        )}
      </form>
    </div>
  );
}