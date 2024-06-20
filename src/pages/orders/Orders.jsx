import { useMemo } from "react";
import { CardBox, Headings, Page, Paginate, Texts } from "@/components";
import styles from "../pages.module.css";
import { Alert, Badge, Spinner, Table } from "react-bootstrap";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useAuth, useFetch, useTitle } from "@/hooks";
import { orderService } from "@/api";
import { formatCurrency, formatDate } from "@/utils";
import { GiMoneyStack } from "react-icons/gi";

export default function Orders() {
  useTitle("Your orders");
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const params = new URLSearchParams(searchParams);
  const { merchant, itemsPerPage } = useAuth();
  const { error, data, loading } = useFetch(
    orderService.getAllOrders,
    merchant?.merchantCode,
    page
  );
  const orders = useMemo(() => data, [data]);
  const location = useLocation();
  const navigate = useNavigate();
  const totalPages = orders.totalPages;
  const count = orders.count;
  const prevPage = itemsPerPage * (parseInt(page) - 1) > 0;
  const nextPage = itemsPerPage * (parseInt(page) - 1) + itemsPerPage < count;
  const firstPage = 1;
  const lastPage = Math.ceil(count / itemsPerPage);

  const handlePageChange = (type) => {
    type === "prev"
      ? params.set("page", parseInt(page) - 1)
      : params.set("page", parseInt(page) + 1);
    navigate(window.location.pathname + "?" + params.toString());
  };

  const handleFirstPage = () => {
    params.set("page", firstPage);
    navigate(window.location.pathname + "?" + params.toString());
  };

  const handleLastPage = () => {
    params.set("page", lastPage);
    navigate(window.location.pathname + "?" + params.toString());
  };

  const NoOrders = () => {
    return (
      <div className={`${styles.ordersBg}`}>
        <Page>
          <Headings text="Orders" size="1.5rem" />
          <div className="mt-5 d-flex justify-content-center align-items-center">
            <CardBox style={{ maxWidth: "450px" }}>
              <Texts text="View orders" size="16px" className="fw-bold" />
              <Texts
                text="Make your first sale! We'll then show you orders and sales displayed over time."
                size="14px"
                className="fw-medium"
              />
            </CardBox>
          </div>
        </Page>
      </div>
    );
  };
  const ShowOrders = () => {
    return (
      <>
        <Table
          hover
          striped
          bordered
          responsive
          className="mt-3 shadow-sm rounded-3"
        >
          <thead>
            <tr className="small">
              <th>ORDER REF</th>
              <th>DATE</th>
              <th>STATUS</th>
              <th>AMOUNT</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders?.orders?.map(
              ({
                _id,
                shippingDetails,
                createdAt,
                orderStatus,
                total,
                isPaid,
                reference,
              }) => (
                <tr
                  key={_id}
                  className="cursor small fw-medium"
                  onClick={() => navigate(`/orders/${_id}`)}
                  title="click to see details"
                >
                  <td>
                    {shippingDetails.fullname}
                    <br />

                    <span className="text-primary">
                      {" "}
                      {reference ? reference : _id}
                    </span>
                  </td>
                  <td>{formatDate(createdAt)}</td>
                  <td className="text-info text-uppercase">
                    <Badge
                      pill
                      bg={
                        orderStatus === "fulfilled"
                          ? "success"
                          : orderStatus === "processing"
                          ? "info"
                          : "warning"
                      }
                      text="light"
                      className="p-2"
                    >
                      {orderStatus}
                    </Badge>
                  </td>
                  <td
                    className={`fw-bold ${
                      !isPaid ? "text-danger" : "text-success"
                    }`}
                  >
                    {formatCurrency(merchant?.currency, total)}
                  </td>
                  <td>
                    <Badge
                      bg="danger"
                      text="light"
                      onClick={() => navigate(`/orders/${_id}`)}
                    >
                      VIEW
                    </Badge>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </>
    );
  };
  return (
    <>
      {location.pathname === "/orders" ? (
        <>
          {error && (
            <Alert variant="danger" className="mt-5">
              {error?.response?.data?.error || error.message}
            </Alert>
          )}
          <>
            {loading ? (
              <div className="d-flex mt-5 justify-content-center">
                <Spinner animation="grow" size="sm" />
              </div>
            ) : (
              <>
                {orders?.orders?.length > 0 ? (
                  <>
                    {" "}
                    <div
                      className={`d-none d-lg-flex flex-column justify-content-center align-items-center ${styles.ordersBgMini} `}
                    >
                      <GiMoneyStack
                        size="4rem"
                        color="red"
                        className="text-center"
                      />
                      <CardBox style={{ maxWidth: "450px", opacity: "0.9" }}>
                        <Texts
                          text="Make your first sale!"
                          size="1.8rem"
                          className="fw-bold text-center"
                        />
                        <Texts
                          text="We'll then show you orders and sales displayed over time."
                          size="1.4rem"
                          className="fw-medium text-center"
                        />
                      </CardBox>
                    </div>
                    <Page>
                      <Headings text="Orders" size="1.5rem" />
                      {loading ? (
                        <div className="d-flex mt-5 justify-content-center">
                          <Spinner animation="grow" size="sm" />
                        </div>
                      ) : (
                        <ShowOrders />
                      )}
                      <Paginate
                        prevPage={prevPage}
                        nextPage={nextPage}
                        page={page}
                        handleLastPage={handleLastPage}
                        handleFirstPage={handleFirstPage}
                        handlePageChange={handlePageChange}
                        totalPages={totalPages}
                        lastPage={lastPage}
                        itemsPerPage={itemsPerPage}
                      />
                    </Page>
                  </>
                ) : (
                  <NoOrders />
                )}
              </>
            )}
          </>
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
}
