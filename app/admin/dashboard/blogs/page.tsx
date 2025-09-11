"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  fetchBlogPosts,
  deleteBlogPost,
  selectAllPosts,
  selectBlogStatus,
} from "@/app/lib/store/features/blogSlice";

export default function BlogList() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectAllPosts);
  const status = useAppSelector(selectBlogStatus);

  useEffect(() => {
    dispatch(fetchBlogPosts());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      dispatch(deleteBlogPost(id));
    }
  };

  if (status === "loading") return <p>Loading blogs...</p>;
  if (status === "failed") return <p>Failed to load blogs.</p>;

  return (
    <div className="container mx-auto py-6">
      {/* Header with Add Blog button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Link href="/admin/dashboard/blogs/create">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            + Add Blog
          </button>
        </Link>
      </div>

      {/* Blog list */}
      <ul className="space-y-4">
        {posts.map((post) => (
          <li
            key={post.id}
            className="border p-4 rounded shadow-sm flex justify-between items-center"
          >
            <div>
              <Link href={`/admin/dashboard/blogs/${post.slug}`}>
                <h2 className="text-xl font-semibold hover:underline cursor-pointer">
                  {post.title}
                </h2>
              </Link>
              {post.excerpt && (
                <p className="text-gray-600 mt-1">{post.excerpt}</p>
              )}
            </div>

            <div className="flex gap-2">
              {/* View */}
              <Link href={`/admin/dashboard/blogs/${post.id}/${post.slug}`}>
                <button className="px-3 py-1 border rounded hover:bg-gray-100">
                  View
                </button>
              </Link>

              {/* Edit */}
              <Link
                href={`/admin/dashboard/blogs/edit/${post.id}/${post.slug}`}
              >
                <button className="px-3 py-1 border rounded hover:bg-gray-100">
                  Edit
                </button>
              </Link>

              {/* Delete */}
              <button
                className="px-3 py-1 border rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => handleDelete(post.id!)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
