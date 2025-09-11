"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { fetchBlogPosts } from "@/app/lib/store/features/blogSlice";
import { getImageUrl } from "@/app/utils/getImageUrl";
import Heading from "@/app/commonComponents/heading";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { slugify } from "@/app/utils/slugify";

const AllBlogsHomePage = () => {
  const dispatch = useAppDispatch();
  const { posts, status } = useAppSelector((state) => state.blog);

  useEffect(() => {
    if (status === "idle") dispatch(fetchBlogPosts());
  }, [dispatch, status]);

  if (status === "loading")
    return (
      <div className="text-center py-8 text-gray-500">Loading blogs...</div>
    );
  if (status === "failed")
    return (
      <div className="text-center py-8 text-red-500">Failed to load blogs.</div>
    );
  if (!posts || posts.length === 0) return null;

  return (
    <div className="p-6 md:p-12 bg-gray-50">
      <div className="flex items-center justify-between mb-8">
        <Heading title="Latest Blogs" />
        <Link href="/blogs">
          <button className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800 transition-colors">
            View All <ArrowRight size={16} />
          </button>
        </Link>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {posts.slice(0, 4).map((post) => (
          <Link key={post.id} href={`/blogs/${post.id}/${slugify(post.slug!)}`}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all cursor-pointer flex flex-col">
              <div className="h-48 w-full relative overflow-hidden">
                {post.featuredImage ? (
                  <img
                    src={getImageUrl(post.featuredImage)}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 font-medium">
                    No Image
                  </div>
                )}
                {/* Optional gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold mb-2 line-clamp-2 text-gray-900">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                <span className="mt-auto text-blue-600 font-semibold flex items-center gap-1 hover:text-blue-800 transition-colors">
                  Read More <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllBlogsHomePage;
