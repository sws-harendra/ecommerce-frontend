"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { fetchArtists } from "@/app/lib/store/features/artistSlice";
import { getImageUrl } from "@/app/utils/getImageUrl";
import Heading from "@/app/commonComponents/heading";
import { ArrowRight } from "lucide-react"; // arrow icon
import Link from "next/link";
import { slugify } from "@/app/utils/slugify";

const AllArtistsHomePage = () => {
  const dispatch = useAppDispatch();
  const { artists, status } = useAppSelector((state) => state.artist);

  useEffect(() => {
    if (status === "idle") dispatch(fetchArtists());
  }, [dispatch, status]);

  if (status === "loading") return <div>Loading artists...</div>;
  if (status === "failed") return <div>Failed to load artists.</div>;

  // Hide entire section if there are no artists
  if (!artists || artists.length === 0) return null;

  return (
    <div className="py-4 px-12">
      <div className="flex items-center justify-between mb-4">
        <Heading title="Artists" />
        <Link href={"/artists"}>
          <button className="flex items-center gap-1 text-blue-500 font-medium hover:underline">
            View All <ArrowRight size={16} />
          </button>
        </Link>
      </div>

      <div
        className="grid grid-flow-row auto-rows-auto gap-6 justify-center"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        }}
      >
        {artists.slice(0, 4).map((artist) => (
          <Link
            href={`/artists/${slugify(artist.name)}/${artist.id}`}
            key={artist.id}
          >
            <div
              key={artist.id}
              className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 mb-2 flex items-center justify-center">
                {artist.image ? (
                  <img
                    src={getImageUrl(artist.image)}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <span className="text-center font-medium">{artist.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllArtistsHomePage;
