import Heading from "@/app/commonComponents/heading";
import { brandName } from "@/app/contants";
import React from "react";

const AboutUs = () => {
  return (
    <section className="relative mx-auto my-5 px-6 max-w-[95%]">
      {/* Section Header */}
      <div className="text-center mb-14">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
          About <span className="text-blue-600">Us</span>
        </h2>
        <p className="mt-3 text-gray-600 text-base lg:text-lg">
          A little information about us.
        </p>
      </div>

      {/* Content Card */}
      <div className="bg-white shadow-lg rounded-3xl md:p-12 border border-gray-100 overflow-hidden relative">
        {/* Decorative Background Gradient */}
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 rounded-full opacity-30 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-gradient-to-r from-green-200 via-yellow-200 to-blue-200 rounded-full opacity-30 blur-3xl pointer-events-none"></div>

        <div className="relative space-y-6">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            At{" "}
            <span className="font-semibold text-gray-900 italic">
              {brandName}
            </span>
            , we bring you{" "}
            <span className="text-gray-900 font-medium">
              handmade paintings
            </span>
            created by passionate artists. Each artwork is unique, crafted with
            care, and made to add beauty, warmth, and personality to your space.
            Our goal is to make authentic art accessible, affordable, and
            timeless.
          </p>

          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            We believe art should be{" "}
            <span className="font-semibold text-indigo-600">
              accessible, affordable, and timeless
            </span>
            . That’s why we ensure safe packaging, worldwide delivery, and the
            promise that what you receive is as authentic as the artist’s
            vision.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
