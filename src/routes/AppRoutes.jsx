import {
  Register,
  Login,
  New,
  Account,
  GetStarted,
  Merchant,
  Tax,
  Discount,
  AddDiscount,
  EditDiscount,
  Categories,
  AddCategory,
  EditCategory,
  Products,
  AddProducts,
  EditProduct,
  Orders,
  EditTax,
  Shipping,
  EditShipping,
  OrderId,
  Customers,
  CustomerOrders,
  ForgotPassword,
  ResetPassword,
} from "@/pages";
import { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "@/hooks";
import { ProtectedUser, ProtectedMerchant } from "@/routes";
import { Loading } from "@/components";

const RootLayout = lazy(() => import("@/layouts/RootLayout"));
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));
const PageNotFound = lazy(() => import("@layouts/PageNotFound"));

const AppRoutes = () => {
  const { token, merchant } = useAuth();

  const routes = [
    {
      path: "/",
      name: "Root",
      element: (
        <Suspense fallback={<Loading />}>
          <ProtectedUser isAuth={token}>
            <RootLayout />
          </ProtectedUser>
        </Suspense>
      ),
      children: [
        {
          path: "/",
          element: <GetStarted />,
        },
        {
          path: "account",
          element: <Account />,
        },
        {
          path: "merchant",
          element: (
            <ProtectedMerchant isAuth={merchant}>
              <Merchant />
            </ProtectedMerchant>
          ),
        },
        {
          path: "tax",
          element: (
            <ProtectedMerchant isAuth={merchant}>
              <Tax />
            </ProtectedMerchant>
          ),
          children: [{ path: "/tax/:taxId", element: <EditTax /> }],
        },
        {
          path: "discounts",
          element: (
            <ProtectedMerchant isAuth={merchant}>
              <Discount />
            </ProtectedMerchant>
          ),
          children: [
            { path: "add", element: <AddDiscount /> },
            { path: "/discounts/:discountId", element: <EditDiscount /> },
          ],
        },
        {
          path: "shipping",
          element: (
            <ProtectedMerchant isAuth={merchant}>
              <Shipping />
            </ProtectedMerchant>
          ),
          children: [
            { path: "/shipping/:shippingId", element: <EditShipping /> },
          ],
        },
        {
          path: "categories",
          element: (
            <ProtectedMerchant isAuth={merchant}>
              <Categories />
            </ProtectedMerchant>
          ),
          children: [
            { path: "add", element: <AddCategory /> },
            { path: "/categories/:categoryId", element: <EditCategory /> },
          ],
        },
        {
          path: "products",
          element: (
            <ProtectedMerchant isAuth={merchant}>
              <Products />
            </ProtectedMerchant>
          ),
          children: [
            { path: "add", element: <AddProducts /> },
            { path: "/products/:slug", element: <EditProduct /> },
          ],
        },
        {
          path: "orders",
          element: (
            <ProtectedMerchant isAuth={merchant}>
              <Orders />
            </ProtectedMerchant>
          ),
          children: [{ path: "/orders/:orderId", element: <OrderId /> }],
        },
        {
          path: "customers",
          element: (
            <ProtectedMerchant isAuth={merchant}>
              <Customers />
            </ProtectedMerchant>
          ),
          children: [
            { path: "/customers/:username", element: <CustomerOrders /> },
          ],
        },
      ],
    },
    {
      path: "authorize",
      name: "Auth",
      element: (
        <Suspense fallback={<Loading />}>
          <AuthLayout />
        </Suspense>
      ),
      children: [
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "reset-password/:userId/:token",
          element: <ResetPassword />,
        },
      ],
    },
    {
      path: "merchant-new",
      element: (
        <Suspense fallback={<Loading />}>
          <ProtectedUser isAuth={token}>
            <New />
          </ProtectedUser>
        </Suspense>
      ),
    },
    {
      path: "*",
      element: (
        <Suspense fallback={<Loading />}>
          <ProtectedUser isAuth={token}>
            <PageNotFound />
          </ProtectedUser>
        </Suspense>
      ),
    },
  ];

  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
};

export default AppRoutes;
