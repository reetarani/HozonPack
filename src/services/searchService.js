import { api } from "./apiClient";

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