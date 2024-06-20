import { http } from "@/utils";

const createMerchant = (credentials, token) => {
  return http.post("/merchant/create", credentials, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
const getMerchant = (token) => {
  return http.get(`/merchant`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateMerchant = (id, credentials, token) => {
  return http.patch(`/merchant/${id}/update`, credentials, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteMerchant = (token) => {
  return http.delete("/merchant/delete", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const merchantSales = (merchantCode, token) => {
  return http.get(`/merchant/${merchantCode}/get/sales`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default {
  createMerchant,
  getMerchant,
  updateMerchant,
  deleteMerchant,
  merchantSales,
};
