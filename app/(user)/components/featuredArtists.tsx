"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";

import { artistService } from "@/app/sercices/user/artist.service";
import { Artist } from "@/app/types/artist.types";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { slugify } from "@/app/utils/slugify";
import Heading from "@/app/commonComponents/heading";

const FeaturedArtists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const data: any = await artistService.featuredArtist();
        setArtists(data);
      } catch (error) {
        console.error("Error fetching featured artists:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-600">
        <div className="animate-pulse text-lg">
          🎨 Loading featured artists...
        </div>
      </div>
    );
  }

  return (
    <section className="relative py-3 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 flex items-center justify-center gap-2">
            ⭐ Featured <span className="text-blue-600">Artists</span>
          </h2>
          <p className="mt-3 text-gray-600">
            Discover the most celebrated and trending artists of the moment.
          </p>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 4000 }}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {artists.map((artist) => (
            <SwiperSlide key={artist.id}>
              <Link href={`/artists/${slugify(artist.name)}/${artist.id}`}>
                <div className="group m-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                  {/* Artist Image */}
                  {artist.image && (
                    <div className="relative w-full h-64 overflow-hidden">
                      <Image
                        src={getImageUrl(artist.image)}
                        alt={artist.name}
                        fill
                        className="object-cover transform group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white drop-shadow-lg">
                        {artist.name}
                      </h3>
                    </div>
                  )}

                  {/* Artist Content */}
                  <div className="p-5">
                    <p className="text-gray-600 line-clamp-3">
                      {artist.aboutArtist || "No bio available"}
                    </p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedArtists;
