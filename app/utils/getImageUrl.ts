// utils/getImageUrl.ts

import { serverurl } from "../contants";

export const getImageUrl = (path?: string): string => {
  if (!path) return "/placeholder.png"; // fallback if no image
  const BASE_URL = serverurl || "http://localhost:5000";
  return `${BASE_URL}/uploads/${path}`;
};
