import { http } from "@/utils";

const login = (credentials) => {
  return http.post("/auth/login", credentials);
};

const register = (credentials) => {
  return http.post("/auth/register", credentials);
};

const refreshToken = (refreshToken) => {
  return http.post("/auth/refresh-token", refreshToken);
};

const authUser = (token) => {
  return http.get("/auth", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateAccount = (credentials, token) => {
  return http.patch("/auth/update-account", credentials, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteAccount = (token) => {
  return http.delete("/auth/delete-account", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const forgotPassword = (email) => {
  return http.post("/auth/forgot-password", email);
};

const resetPassword = (userId, token, password) => {
  return http.patch(`/auth/reset-password/${userId}/${token}`, password);
};

export default {
  login,
  register,
  authUser,
  refreshToken,
  updateAccount,
  deleteAccount,
  forgotPassword,
  resetPassword,
};
