import { usePersist } from "@/hooks";
import { merchantService, userService } from "@/api";
import { createContext, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = usePersist("sellerLoggedIn", null);
  const [token, setToken] = usePersist("sellerToken", null);
  const [refreshToken, setRefreshToken] = usePersist("sellerRefreshToken", null);
  const [merchant, setMerchant] = usePersist("merchant", null);
  // const customId = "custom-id-yes";

  function isTokenValid(token) {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch (error) {
      return false;
    }
  }

  const logout = useCallback(() => {
    if (!token) {
      return;
    } else {
      toast.info("You are logged out.", { toastId: "logout-id" });
      setLoggedInUser(null);
      setToken(null);
      setRefreshToken(null);
      setMerchant(null);
    }
  }, [setLoggedInUser, setMerchant, setRefreshToken, setToken, token]);

  const getUser = useCallback(async () => {
    if (!token) return;
    if (isTokenValid(token)) {
      try {
        const { data } = await userService.authUser(token);
        setLoggedInUser(data);
      } catch (error) {
        console.error(error);
      }
    }
  }, [setLoggedInUser, token]);

  const getMerchant = useCallback(async () => {
    if (!token) return;
    if (isTokenValid(token)) {
      try {
        const { data } = await merchantService.getMerchant(token);
        setMerchant(data);
      } catch (error) {
        console.error(error);
      }
    }
  }, [setMerchant, token]);

  useEffect(() => {
    if (loggedInUser && merchant) {
      return;
    } else {
      getUser();
      getMerchant();
    }
  }, [getUser, getMerchant, loggedInUser, merchant]);

  const refreshUserToken = useCallback(async () => {
    try {
      const { data } = await userService.refreshToken({
        refreshToken: refreshToken,
      });
      setToken(data.accessToken);
      getUser();
    } catch (error) {
      console.error(error);
      setLoggedInUser(null);
      setToken(null);
    }
  }, [refreshToken, setToken, getUser, setLoggedInUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshUserToken();
    }, 12 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshUserToken]);

  useEffect(() => {
    const refresh = async () => {
      try {
        await refreshUserToken();
      } catch (error) {
        console.error(error);
        logout();
      }
    };

    if (token) {
      const tokenExp = new Date(jwtDecode(token).exp * 1000);
      const now = new Date();
      if (tokenExp - now < 60 * 1000) {
        refresh();
      }
    }
  }, [logout, refreshUserToken, token]);

  const itemsPerPage = 10;

  const contextData = {
    loggedInUser,
    setLoggedInUser,
    token,
    setToken,
    merchant,
    setMerchant,
    setRefreshToken,
    logout,
    getUser,
    getMerchant,
    itemsPerPage,
  };
  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
