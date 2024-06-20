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
import { customerService } from "@/api";
import { useAuth, useFetch, useTitle } from "@/hooks";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { formatCurrency } from "@/utils";

export default function Customers() {
  useTitle("Your customers");
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const params = new URLSearchParams(searchParams);
  const { merchant, itemsPerPage } = useAuth();
  const { error, data, loading } = useFetch(
    customerService.getAllCustomers,
    merchant?.merchantCode,
    page
  );
  const customers = useMemo(() => data, [data]);
  const location = useLocation();
  const navigate = useNavigate();
  const totalPages = customers.totalPages;
  const count = customers.count;
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

  const NoCustomers = () => {
    return (
      <div className={`${styles.customerBg}`}>
        <Page>
          <Headings text="Customers" size="1.5rem" />
          <div className="mt-5 d-flex justify-content-center align-items-center">
            <CardBox style={{ maxWidth: "450px" }}>
              <Texts
                text="See your customers."
                size="16px"
                className="fw-bold"
              />
              <Texts
                text="See all who have placed orders on your site, track their spendings, as well message them."
                size="14px"
                className="fw-medium"
              />
            </CardBox>
          </div>
        </Page>
      </div>
    );
  };

  const ShowCustomers = () => {
    return (
      <>
        <Headings text="Customers" size="1.5rem" />
        <Table hover striped bordered responsive className="mt-5 shadow-sm">
          <thead>
            <tr className="small">
              <th>USERNAME</th>
              <th>EMAIL</th>
              <th>TOTAL ORDERS</th>
              <th>TOTAL SPENT</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {customers?.customers.map(
              ({ _id, username, email, photo, totalOrders, totalSpent }) => (
                <tr
                  key={_id}
                  className="small cursor fw-medium"
                  onClick={() => navigate(`/customers/${username}`)}
                  title="click to see more"
                >
                  <td className="d-flex gap-2 align-items-center">
                    <LazyLoadImage
                      effect="blur"
                      src={photo}
                      alt={username}
                      width={35}
                      height={35}
                      className="object-fit-cover rounded-circle"
                    />
                    <div>{username}</div>
                  </td>
                  <td>{email}</td>
                  <td>{totalOrders}</td>
                  <td className="text-success fw-semibold">
                    {formatCurrency(merchant?.currency, totalSpent)}
                  </td>
                  <td>
                    <Badge
                      bg="danger"
                      text="light"
                      onClick={() => navigate(`/customers/${username}`)}
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
      {location.pathname === "/customers" ? (
        <>
          {error && (
            <Alert variant="danger">
              {error?.response?.data?.error || error.message}
            </Alert>
          )}
          <>
            {loading ? (
              <div className="d-flex mt-5 align-items-center justify-content-center min-vh-100">
                <Spinner animation="grow" size="sm" />
              </div>
            ) : (
              <>
                {customers?.customers?.length > 0 ? (
                  <Page>
                    <ShowCustomers />
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
                ) : (
                  <NoCustomers />
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
