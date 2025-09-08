import React from "react";
import EcommerceNavbar from "./components/navbar";
import BannerCarousel from "./components/caraousel";
import TrendingProducts from "./components/trendingProducts";
import ShopByCategory from "./shop-by-category/page";
import AllSections from "./components/allSections";
import VideoProduct from "./components/videoProduct";
import AboutUs from "./components/aboutUs";

const HomePage = () => {
  return (
    <div>
      <BannerCarousel />
      <VideoProduct />

      <TrendingProducts />
      <AllSections />
      <AboutUs />
      {/* <ShopByCategory /> */}
    </div>
  );
};

export default HomePage;
