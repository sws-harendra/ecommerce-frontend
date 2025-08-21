import React from "react";
import { Edu_NSW_ACT_Foundation } from "next/font/google";

const eduCursive = Edu_NSW_ACT_Foundation({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const Heading = ({ title }: { title: string }) => {
  return <div className={`text-xl my-4 ${eduCursive.className}`}>{title}</div>;
};
export default Heading;
