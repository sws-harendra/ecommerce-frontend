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
import Heading from "@/app/commonComponents/heading";

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
    <div className="overflow-x-hidden mx-auto py-12 px-12">
      <Heading
        title="What Our Clients Say
"
      />

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-12"
      >
        {testimonials.map((t) => (
          <SwiperSlide key={t.id}>
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col items-center text-center transition-transform hover:scale-104">
              {t.image && (
                <img
                  src={getImageUrl(t.image)}
                  alt={t.name}
                  className="w-20 h-20 rounded-full object-cover mb-4 shadow-md"
                />
              )}

              <Quote className="w-8 h-8 text-indigo-500 mb-4" />

              <p className="text-gray-600 italic mb-4 text-sm line-clamp-4">
                "{t.message}"
              </p>

              <h3 className="font-semibold text-lg">{t.name}</h3>
              <p className="text-sm text-gray-500">{t.designation}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
