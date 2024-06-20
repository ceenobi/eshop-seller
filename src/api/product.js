import { http } from "@/utils";

const addProduct = (merchantCode, credentials, token) => {
  return http.post(`/product/${merchantCode}/create`, credentials, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getAllProducts = (merchantCode, page) => {
  return http.get(`/product/${merchantCode}/all?page=${page}`);
};

const getAProduct = (merchantCode, slug) => {
  return http.get(`/product/${merchantCode}/get/${slug}`);
};

const updateProduct = (merchantCode, productId, credentials, token) => {
  return http.patch(`/product/${merchantCode}/update/${productId}`, credentials, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteProduct = (merchantCode, productId, token) => {
  return http.delete(`/product/${merchantCode}/delete/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default {
  addProduct,
  getAllProducts,
  getAProduct,
  updateProduct,
  deleteProduct,
};
