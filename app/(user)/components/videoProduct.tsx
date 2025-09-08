"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { fetchVideos } from "@/app/lib/store/features/video.slice";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";
import { slugify } from "@/app/utils/slugify";
import { getImageUrl } from "@/app/utils/getImageUrl";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Import Swiper components and modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

export default function VideoProduct() {
  const dispatch = useAppDispatch();
  const { videos } = useAppSelector((state) => state.video);
  const [unmutedId, setUnmutedId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    dispatch(fetchVideos());
  }, [dispatch]);

  const toggleMute = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (unmutedId === id) {
      videoRefs.current[id]?.pause();
      setUnmutedId(null);
      setIsPlaying(null);
    } else {
      // Mute all others
      Object.keys(videoRefs.current).forEach((key) => {
        const video = videoRefs.current[Number(key)];
        if (video) {
          video.muted = true;
          video.pause();
        }
      });

      // Unmute/play the selected video
      const video = videoRefs.current[id];
      if (video) {
        video.muted = false;
        video.play();
        setUnmutedId(id);
        setIsPlaying(id);
      }
    }
  };

  const togglePlayPause = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const video = videoRefs.current[id];
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(id);
      } else {
        video.pause();
        setIsPlaying(null);
      }
    }
  };

  const handleAutoScrollToggle = () => {
    setIsAutoScrolling(!isAutoScrolling);
    if (swiperRef.current && swiperRef.current.swiper) {
      if (!isAutoScrolling) {
        swiperRef.current.swiper.autoplay.start();
      } else {
        swiperRef.current.swiper.autoplay.stop();
      }
    }
  };

  const handleShopNowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Additional debugging
    console.log("Shop Now clicked!");
  };

  if (!videos.length)
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center mb-4">
          <Volume2 className="w-8 h-8 text-white" />
        </div>
        <p className="text-gray-600 text-lg font-medium">No videos available</p>
      </div>
    );

  return (
    <div className="relative py-12 px-6 overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Featured Products
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover amazing products through immersive video experiences
        </p>
      </div>

      {/* Video Carousel with Swiper */}
      <div className="relative max-w-7xl mx-auto">
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={32}
          slidesPerView={1}
          centeredSlides={false}
          touchStartPreventDefault={false}
          allowTouchMove={true}
          simulateTouch={false}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 28,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 32,
            },
          }}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          pagination={{
            clickable: true,
            el: ".swiper-pagination-custom",
            renderBullet: function (index, className) {
              return `<span class="${className}"></span>`;
            },
          }}
          autoplay={
            isAutoScrolling
              ? { delay: 4000, disableOnInteraction: false }
              : false
          }
          loop={true}
          className="pb-16"
        >
          {videos.map((video) => (
            <SwiperSlide key={video.id}>
              <div className="relative group h-full">
                {/* Video Card - Full Height with No Background */}
                <div className="relative rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-[1.02]">
                  {/* Video Container - Increased Height */}
                  <div className="relative h-[450px] overflow-hidden rounded-3xl">
                    <video
                      ref={(el) => (videoRefs.current[video.id] = el)}
                      src={getImageUrl(video.videoUrl)}
                      muted={unmutedId !== video.id}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      style={{ pointerEvents: "none" }}
                      loop
                      playsInline
                    />

                    {/* Enhanced Gradient Overlay for Better Text Readability */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                      style={{ pointerEvents: "none" }}
                    />

                    {/* Product Info Overlay - Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-40 pointer-events-none">
                      <h3 className="font-bold text-2xl mb-3 leading-tight">
                        {video.Product?.name || `Product #${video.productId}`}
                      </h3>

                      {video.Product?.description && (
                        <p className="text-white/90 text-base mb-4 leading-relaxed line-clamp-2">
                          {video.Product.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pointer-events-auto">
                        {video.Product?.price && (
                          <span className="text-3xl font-bold text-yellow-400 drop-shadow-lg">
                            ${video.Product.price}
                          </span>
                        )}

                        <Link
                          href={`/products/${slugify(
                            video.Product?.name || "product"
                          )}/${video.productId}`}
                          onClick={handleShopNowClick}
                          className="bg-white text-black px-8 py-3 rounded-full text-base font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 relative z-50 pointer-events-auto"
                          style={{
                            pointerEvents: "auto",
                            position: "relative",
                            zIndex: 50,
                          }}
                        >
                          Shop Now
                        </Link>
                      </div>
                    </div>

                    {/* Video Controls Overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="absolute top-6 right-6 flex gap-3 pointer-events-auto z-30">
                        <button
                          onClick={(e) => toggleMute(video.id, e)}
                          className="bg-black/60 backdrop-blur-md p-3 rounded-full hover:bg-black/80 shadow-xl transition-all duration-300 border border-white/20 pointer-events-auto"
                        >
                          {unmutedId === video.id ? (
                            <Volume2 className="h-5 w-5 text-white" />
                          ) : (
                            <VolumeX className="h-5 w-5 text-white" />
                          )}
                        </button>
                        <button
                          onClick={(e) => togglePlayPause(video.id, e)}
                          className="bg-black/60 backdrop-blur-md p-3 rounded-full hover:bg-black/80 shadow-xl transition-all duration-300 border border-white/20 pointer-events-auto"
                        >
                          {isPlaying === video.id ? (
                            <Pause className="h-5 w-5 text-white" />
                          ) : (
                            <Play className="h-5 w-5 text-white" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Playing indicator */}
                    {isPlaying === video.id && (
                      <div className="absolute top-6 left-6 pointer-events-none z-20">
                        <div className="flex items-center gap-2 bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          Playing
                        </div>
                      </div>
                    )}

                    {/* Hover Overlay Effect */}
                    <div className="absolute inset-0 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-200 hover:border-purple-300">
          <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-purple-600 transition-colors" />
        </div>
        <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-200 hover:border-purple-300">
          <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-purple-600 transition-colors" />
        </div>

        {/* Custom Pagination */}
        <div className="swiper-pagination-custom flex justify-center mt-12 gap-3"></div>
      </div>

      {/* Auto-scroll Toggle */}
      <div className="flex justify-center mt-8"></div>

      <style jsx global>{`
        .swiper-button-next-custom,
        .swiper-button-prev-custom {
          position: absolute;
          margin-top: 0;
          width: auto;
          height: auto;
          top: 50%;
          transform: translateY(-50%);
        }

        .swiper-pagination-custom span {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #d1d5db;
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0.7;
        }

        .swiper-pagination-custom span:hover {
          background: #9ca3af;
          opacity: 1;
          transform: scale(1.1);
        }

        .swiper-pagination-custom span.swiper-pagination-bullet-active {
          background: linear-gradient(135deg, #9333ea, #db2777);
          width: 40px;
          border-radius: 12px;
          opacity: 1;
          transform: scale(1.1);
        }

        /* Text truncation utilities */
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Smooth scrolling */
        .swiper {
          overflow: visible;
        }

        .swiper-slide {
          height: auto;
        }

        /* Enhanced hover effects */
        .swiper-slide:hover {
          z-index: 10;
        }

        /* Ensure clickable elements work */
        .pointer-events-auto {
          pointer-events: auto !important;
        }

        .pointer-events-none {
          pointer-events: none !important;
        }
      `}</style>
    </div>
  );
}
