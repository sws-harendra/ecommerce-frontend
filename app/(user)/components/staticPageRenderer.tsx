"use client";

import { useEffect, useState } from "react";
import { pageService } from "@/app/sercices/user/staticpage.service";

type StaticPageProps = {
  slug: string;
};

export default function StaticPageRenderer({ slug }: StaticPageProps) {
  const [page, setPage] = useState<{ title: string; content: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const data = await pageService.getPageBySlug(slug);
        setPage(data);
      } catch (err) {
        console.error("Error fetching page:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!page) return <p>Page not found</p>;

  return (
    <div className="max-w-4xl mx-auto py-6 prose">
      <h1 className="text-2xl font-bold mb-4">{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </div>
  );
}
