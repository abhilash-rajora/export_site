import { useState } from "react";
import api from "../../api/axios";

export default function AdminSeoPage() {
  const [form, setForm] = useState({
    page: "home",
    title: "",
    description: "",
    keywords: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/seo", form);
    alert("SEO Updated Successfully");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">SEO Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select name="page" onChange={handleChange} className="border p-2 w-full">
          <option value="home">Home</option>
          <option value="about">About</option>
          <option value="products">Products</option>
        </select>

        <input
          type="text"
          name="title"
          placeholder="Meta Title"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <textarea
          name="description"
          placeholder="Meta Description"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          type="text"
          name="keywords"
          placeholder="Keywords (comma separated)"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <button className="bg-gold-400 px-4 py-2">
          Save
        </button>
      </form>
    </div>
  );
}
