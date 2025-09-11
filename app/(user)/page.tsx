import React from "react";
import EcommerceNavbar from "./components/navbar";
import BannerCarousel from "./components/caraousel";
import TrendingProducts from "./components/trendingProducts";
import ShopByCategory from "./shop-by-category/page";
import AllSections from "./components/allSections";
import VideoProduct from "./components/videoProduct";
import AboutUs from "./components/aboutUs";
import AllArtistsHomePage from "./components/artists";
import AllBlogsHomePage from "./components/blogs";
import MediaCoveragePage from "./components/mediaCoverage";

const HomePage = () => {
  return (
    <div>
      <BannerCarousel />
      <VideoProduct />

      <TrendingProducts />
      <AllSections />
      <AllArtistsHomePage />
      <AllBlogsHomePage />
      <MediaCoveragePage />
      <AboutUs />
      {/* <ShopByCategory /> */}
    </div>
  );
};

export default HomePage;
