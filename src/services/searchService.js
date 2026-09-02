import axios from "axios";

// Use Vite env variable when available, fall back to relative /api for same-origin deployments
const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || "/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10s timeout for network requests
});

export const searchProducts = async (keyword, options = {}) => {
  const { page, limit, signal } = options;

  const params = { q: keyword };
  if (page) params.page = page;
  if (limit) params.limit = limit;

  const response = await api.get(`/public/search`, {
    params,
    signal,
  });

  return response.data;
};

export const getSearchSuggestions = async (keyword, { signal } = {}) => {
  const response = await api.get(`/public/search/suggestions`, {
    params: { q: keyword },
    signal,
  });

  return response.data;
};