"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useAppSelector, useAppDispatch } from "@/app/lib/store/store";
import { fetchTestimonials } from "@/app/lib/store/features/testimonialSlice";
import { useEffect } from "react";
import { Quote } from "lucide-react";
import { getImageUrl } from "@/app/utils/getImageUrl";

export default function TestimonialCarousel() {
  const dispatch = useAppDispatch();
  const { testimonials, status } = useAppSelector((state) => state.testimonial);

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  if (status === "loading") {
    return <p className="text-center">Loading testimonials...</p>;
  }

  if (testimonials.length === 0) {
    return <p className="text-center">No testimonials available</p>;
  }

  return (
    <div className="overflow-x-hidden mx-auto py-16 px-6 lg:px-20 bg-gray-50">
      {/* Heading */}
      <div className="text-center mb-14">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
          ⭐ What Our <span className="text-blue-600">Clients</span> Say
        </h2>
        <p className="mt-3 text-gray-600 text-base lg:text-lg">
          Real feedback from people who trusted us.
        </p>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-14"
      >
        {testimonials.map((t) => (
          <SwiperSlide key={t.id}>
            <div className="bg-white mb-4 rounded-2xl shadow-lg h-full flex flex-col items-center relative overflow-hidden group transition-transform hover:-translate-y-2 hover:shadow-xl">
              {/* Image */}
              {t.image && (
                <img
                  src={getImageUrl(t.image)}
                  alt={t.name}
                  className="w-24 h-24 lg:w-28 lg:h-28 rounded-full object-cover border-4 border-indigo-100 mt-6 mb-4 shadow-md"
                />
              )}

              {/* Quote icon */}
              <Quote className="w-10 h-10 text-indigo-400 mb-4 opacity-60" />

              {/* Testimonial text */}
              <div className="px-6 pb-8 flex-1 flex items-center">
                <p className="text-gray-600 italic text-center text-sm md:text-base line-clamp-1 group-hover:line-clamp-none group-hover:animate-slideUp transition-all duration-300">
                  “{t.message}”
                </p>
              </div>

              {/* Divider */}
              <div className="w-16 h-1 bg-indigo-500 rounded-full mb-4"></div>

              {/* Client info */}
              <div className="text-center pb-6">
                <h3 className="font-semibold text-lg text-gray-900">
                  {t.name}
                </h3>
                <p className="text-sm text-gray-500">{t.designation}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
