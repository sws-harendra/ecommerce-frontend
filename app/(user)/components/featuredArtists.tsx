"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { artistService } from "@/app/sercices/user/artist.service";
import { Artist } from "@/app/types/artist.types";
import { getImageUrl } from "@/app/utils/getImageUrl";
import Heading from "@/app/commonComponents/heading";
import Link from "next/link";
import { slugify } from "@/app/utils/slugify";

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

  if (loading) return <p>Loading featured artists...</p>;

  return (
    <section className="py-6 px-12 overflow-x-hidden">
      <div className=" mx-auto">
        {/* SEO-friendly Heading */}.
        <Heading title="⭐ Featured Artists" />
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          spaceBetween={30}
          slidesPerView={1} // default for smallest screens
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          loop={true}
          className="featured-artist-swiper"
        >
          {artists.map((artist) => (
            <SwiperSlide key={artist.id}>
              {" "}
              <Link href={`/artists/${slugify(artist.name)}/${artist.id}`}>
                <article className="bg-white shadow-lg rounded-2xl overflow-hidden p-6 transition hover:shadow-2xl">
                  {/* Artist Image */}
                  {artist.image && (
                    <div className="h-36 w-36 relative mb-4">
                      <Image
                        src={getImageUrl(artist.image)}
                        alt={artist.name}
                        fill
                        className="object-cover rounded-full"
                        priority
                      />
                    </div>
                  )}
                  {/* Artist Content */}
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">
                      {artist.name}
                    </h3>
                    <p className="text-gray-600">
                      {artist.aboutArtist || "No bio available"}
                    </p>
                  </div>
                </article>{" "}
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedArtists;
