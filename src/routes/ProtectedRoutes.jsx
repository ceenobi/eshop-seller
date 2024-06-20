import { Navigate, useLocation } from "react-router-dom";

export const ProtectedUser = ({ isAuth, children }) => {
  const location = useLocation();

  if (!isAuth) {
    return (
      <Navigate
        to={"/authorize/login"}
        state={{ from: location }}
        replace={true}
      />
    );
  }
  return children;
};

export const ProtectedMerchant = ({ isAuth, children }) => {
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to={"/"} state={{ from: location }} replace={true} />;
  }
  return children;
};
