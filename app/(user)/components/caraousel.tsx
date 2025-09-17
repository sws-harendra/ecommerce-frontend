"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { fetchBanners } from "@/app/lib/store/features/bannerSlice";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import Loader from "@/app/commonComponents/loader";
import { getImageUrl } from "@/app/utils/getImageUrl";

export default function BannerCarousel() {
  const dispatch = useAppDispatch();
  const { banners, error, status } = useAppSelector((state) => state.banners);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>(
    {}
  );

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error as string);
  }, [error]);

  // autoplay
  useEffect(() => {
    if (isPlaying && !isHovered && banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isHovered, banners.length]);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  const goToSlide = (index: number) => setCurrentSlide(index);

  const handleImageLoad = (index: number) =>
    setImageLoaded((prev) => ({ ...prev, [index]: true }));

  const handleBannerClick = (banner: any) => {
    if (banner.link) window.location.href = banner.link;
  };

  const isLoading = status === "loading";
  if (isLoading) return <Loader />;

  if (!banners.length) {
    return (
      <div className="p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="h-64 flex items-center justify-center rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg border border-gray-200">
          <div className="text-gray-500 text-lg font-medium">
            No banners available
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-12">
      {/* Floating carousel wrapper */}
      <div className="relative w-full max-w-[96%] mx-auto">
        {/* Background blur effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl transform scale-105 opacity-50" />

        {/* Main carousel container */}
        <div
          className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] overflow-hidden rounded-3xl shadow-2xl bg-white border border-gray-200/50 backdrop-blur-sm transform transition-all duration-700 hover:shadow-3xl hover:-translate-y-2 hover:scale-[1.02]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Inner shadow for depth */}
          <div className="absolute inset-0 rounded-3xl shadow-inner pointer-events-none z-10" />

          {/* slides */}
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className="min-w-full h-full relative cursor-pointer group overflow-hidden"
                onClick={() => handleBannerClick(banner)}
              >
                <Image
                  src={getImageUrl(banner.imageUrl)}
                  alt={banner.title}
                  fill
                  className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${
                    imageLoaded[index] ? "opacity-100" : "opacity-0"
                  }`}
                  unoptimized
                  onLoad={() => handleImageLoad(index)}
                  loading={index === 0 ? "eager" : "lazy"}
                />

                {!imageLoaded[index] && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Enhanced gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-all duration-500" />

                {/* Additional subtle overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Enhanced text content */}
                <div className="absolute inset-0 flex items-center justify-start z-20">
                  <div className="text-white px-8 sm:px-12 md:px-16 lg:px-20 max-w-3xl transform transition-all duration-700 group-hover:translate-x-2">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-4 leading-tight drop-shadow-xl transform transition-all duration-500 group-hover:scale-105">
                      {banner.title}
                    </h2>
                    {banner.subtitle && (
                      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4 sm:mb-6 opacity-90 font-medium drop-shadow-lg transform transition-all duration-500 delay-100 group-hover:translate-y-1">
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.ctaText && (
                      <button className="bg-gradient-to-r from-white to-gray-100 text-gray-900 hover:from-gray-100 hover:to-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-sm sm:text-base md:text-lg transition-all duration-500 transform hover:scale-110 hover:shadow-2xl flex items-center space-x-3 group/btn">
                        <span className="drop-shadow-sm">{banner.ctaText}</span>
                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-2 group-hover/btn:rotate-12 transition-all duration-300" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-6 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-2xl p-3 transition-all duration-300 hover:scale-110 shadow-xl border border-white/20 z-30 group/nav"
          >
            <ChevronLeft className="w-6 h-6 group-hover/nav:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-6 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-2xl p-3 transition-all duration-300 hover:scale-110 shadow-xl border border-white/20 z-30 group/nav"
          >
            <ChevronRight className="w-6 h-6 group-hover/nav:translate-x-0.5 transition-transform" />
          </button>

          {/* Enhanced play/pause button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute bottom-6 left-6 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-2xl p-3 transition-all duration-300 hover:scale-110 shadow-xl border border-white/20 z-30 group/play"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 group-hover/play:scale-110 transition-transform" />
            ) : (
              <Play className="w-5 h-5 group-hover/play:scale-110 transition-transform" />
            )}
          </button>

          {/* Enhanced counter */}
          <div className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-xl border border-white/20 z-30">
            <span className="drop-shadow-sm">
              {currentSlide + 1} / {banners.length}
            </span>
          </div>

          {/* Enhanced dots indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full border-2 ${
                  currentSlide === index
                    ? "w-8 h-3 bg-white border-white shadow-lg"
                    : "w-3 h-3 bg-white/50 border-white/50 hover:bg-white/70 hover:scale-125"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Floating effect indicators */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-60 animate-pulse" />
        <div
          className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-60 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/4 -right-1 w-2 h-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-60 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>
    </div>
  );
}
