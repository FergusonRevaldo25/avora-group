import type { MetadataRoute } from "next";
import { company } from "@/lib/company";
import { posts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/travel", "/stays", "/about", "/corporate", "/partners", "/property", "/blog", "/privacy", "/terms"];
  return [
    ...pages.map((p) => ({ url: company.site + p })),
    ...posts.map((p) => ({ url: `${company.site}/blog/${p.slug}`, lastModified: p.date })),
  ];
}
