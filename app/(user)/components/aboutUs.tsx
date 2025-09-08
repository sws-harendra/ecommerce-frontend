import Heading from "@/app/commonComponents/heading";
import { brandName } from "@/app/contants";
import React from "react";

const AboutUs = () => {
  return (
    <div className=" mx-auto my-8 px-6">
      {" "}
      <div className="pb-3">
        <Heading title="About Us" />
      </div>
      <div className="border-t-2 py-4  bg-white">
        <p className="text-base text-gray-600 leading-relaxed">
          At{" "}
          <span className="font-semibold text-gray-800 italic">
            {brandName}
          </span>
          , we bring you{" "}
          <span className="text-gray-900 font-medium">handmade paintings</span>{" "}
          created by passionate artists. Each artwork is unique, crafted with
          care, and made to add beauty, warmth, and personality to your space.
          Our goal is to make authentic art accessible, affordable, and
          timeless.
        </p>{" "}
        <p className="text-base text-gray-700 leading-relaxed">
          We believe art should be{" "}
          <span className="font-semibold">
            accessible, affordable, and timeless
          </span>
          . That’s why we ensure safe packaging, worldwide delivery, and the
          promise that what you receive is as authentic as the artist’s vision.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
