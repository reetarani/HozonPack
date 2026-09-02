import axios from "axios";

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || "/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const getPublicProducts = async (options = {}) => {
  const { page, limit, signal } = options;
  const params = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;

  const response = await api.get(`/public/products`, { params, signal });
  return response.data;
};