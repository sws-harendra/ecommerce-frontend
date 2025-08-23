import React from "react";
import EcommerceNavbar from "./components/navbar";
import BannerCarousel from "./components/caraousel";
import TrendingProducts from "./components/trendingProducts";
import ShopByCategory from "./shop-by-category/page";

const HomePage = () => {
  return (
    <div>
      <BannerCarousel />

      <TrendingProducts />
      {/* <ShopByCategory /> */}
    </div>
  );
};

export default HomePage;
