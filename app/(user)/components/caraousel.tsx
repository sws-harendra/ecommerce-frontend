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
      <div className="h-64 flex items-center justify-center">
        No banners available
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Carousel wrapper */}
      <div
        className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] overflow-hidden bg-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* slides */}
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="min-w-full h-full relative cursor-pointer group"
              onClick={() => handleBannerClick(banner)}
            >
              <Image
                src={getImageUrl(banner.imageUrl)}
                alt={banner.title}
                fill
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                  imageLoaded[index] ? "opacity-100" : "opacity-0"
                }`}
                unoptimized
                onLoad={() => handleImageLoad(index)}
                loading={index === 0 ? "eager" : "lazy"}
              />

              {!imageLoaded[index] && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="text-gray-400">Loading...</div>
                </div>
              )}

              {/* gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300" />

              {/* text content */}
              <div className="absolute inset-0 flex items-center justify-start">
                <div className="text-white px-6 sm:px-12 md:px-16 lg:px-20 max-w-2xl">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-4 leading-tight">
                    {banner.title}
                  </h2>
                  {banner.subtitle && (
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4 sm:mb-6 opacity-90 font-medium">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.ctaText && (
                    <button className="bg-white text-gray-900 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-2 group/btn">
                      <span>{banner.ctaText}</span>
                      <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* arrows */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* play/pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute bottom-4 left-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>

        {/* counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentSlide + 1} / {banners.length}
        </div>

        {/* dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition ${
                currentSlide === index ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* thumbnail preview */}
      <div className="hidden md:flex justify-center mt-4 space-x-2">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            onClick={() => goToSlide(index)}
            className={`w-20 h-12 relative cursor-pointer rounded overflow-hidden border-2 ${
              currentSlide === index ? "border-blue-500" : "border-transparent"
            }`}
          >
            <Image
              unoptimized
              src={getImageUrl(banner.imageUrl)}
              alt={banner.title}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
