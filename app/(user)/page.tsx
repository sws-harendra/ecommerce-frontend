import React from "react";
import EcommerceNavbar from "./components/navbar";
import BannerCarousel from "./components/caraousel";
import TrendingProducts from "./components/trendingProducts";
import ShopByCategory from "./shop-by-category/page";
import AllSections from "./components/allSections";

const HomePage = () => {
  return (
    <div>
      <BannerCarousel />

      <TrendingProducts />
      <AllSections />
      {/* <ShopByCategory /> */}
    </div>
  );
};

export default HomePage;
