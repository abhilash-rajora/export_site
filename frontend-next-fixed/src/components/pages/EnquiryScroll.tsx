"use client";

import { useEffect } from "react";

export default function EnquiryScroll({ productName }: { productName: string }) {
  useEffect(() => {
    if (productName) {
      const el = document.getElementById("enquiry-form");
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }, [productName]);

  return null;
}