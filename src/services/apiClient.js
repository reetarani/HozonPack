import axios from "axios";

const rawApiUrl = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL)
  ? import.meta.env.VITE_API_URL
  : "http://localhost:5000/api";

export const API_ROOT = rawApiUrl.replace(/\/api\/?$/, "");
export const API_BASE = rawApiUrl.replace(/\/+$/, "");

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const imageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  return `${API_ROOT}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
};
