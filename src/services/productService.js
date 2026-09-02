import { api } from "./apiClient";

export const getPublicProducts = async (options = {}) => {
  const { page, limit, signal } = options;
  const params = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;

  const response = await api.get(`/public/products`, { params, signal });
  return response.data;
};