import { useMemo } from "react";
import { CardBox, Headings, Page, Paginate, Texts } from "@/components";
import styles from "../pages.module.css";
import { Alert, Badge, Spinner, Table } from "react-bootstrap";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { BiPlus } from "react-icons/bi";
import { productService } from "@/api";
import { useAuth, useFetch, useTitle } from "@/hooks";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { formatCurrency } from "@/utils";
import classnames from "classnames";

export default function Products() {
  useTitle("Your products");
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const params = new URLSearchParams(searchParams);
  const { merchant, itemsPerPage } = useAuth();
  const { error, data, loading } = useFetch(
    productService.getAllProducts,
    merchant?.merchantCode,
    page
  );
  const products = useMemo(() => data, [data]);
  const location = useLocation();
  const navigate = useNavigate();
  const totalPages = products.totalPages;
  const count = products.count;
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

  const NoProducts = () => {
    return (
      <div className={`${styles.productsBg}`}>
        <Page>
          <div className="d-flex justify-content-between align-items-center">
            <Headings text="Products" size="1.5rem" />
            <Badge pill bg="dark" text="light" className="p-2">
              <Link to="/products/add">
                <BiPlus />
                ADD
              </Link>
            </Badge>
          </div>
          <div className="mt-5 d-flex justify-content-center align-items-center">
            <CardBox style={{ maxWidth: "450px" }}>
              <Texts
                text="Add your products."
                size="16px"
                className="fw-bold"
              />
              <Texts
                text="Add your products, set prices, quantity and many more. Time to sell."
                size="14px"
                className="fw-medium"
              />
              <div className="d-flex justify-content-end">
                <Badge pill bg="dark" text="light" className="p-2">
                  <Link to="/products/add">
                    <BiPlus />
                    ADD
                  </Link>
                </Badge>
              </div>
            </CardBox>
          </div>
        </Page>
      </div>
    );
  };

  const ShowProducts = () => {
    return (
      <Table
        hover
        striped
        bordered
        responsive
        className="mt-5 shadow-sm rounded-3"
      >
        <thead>
          <tr className="small">
            <th>PRODUCT</th>
            <th>PRICE</th>
            <th>STOCK</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {products?.products?.map(
            ({ name, image, _id, slug, price, isActive, inStock }) => (
              <tr
                key={_id}
                className="small cursor fw-medium"
                onClick={() => navigate(`/products/${slug}`)}
                title="click to see more"
              >
                <td className="d-flex gap-3 align-items-center">
                  <LazyLoadImage
                    effect="blur"
                    src={image[0]}
                    alt="product images"
                    width={50}
                    height={50}
                    className="object-fit-cover"
                  />
                  <span>{name}</span>
                </td>
                <td>{formatCurrency(merchant?.currency, price)}</td>
                <td
                  className={classnames({
                    "fw-bold": true,
                    "text-success": inStock,
                    "text-danger": !inStock,
                  })}
                >
                  {inStock ? "IN STOCK" : "OUT OF STOCK"}{" "}
                </td>
                <td
                  className={classnames({
                    "fw-bold": true,
                    "text-success": isActive,
                    "text-info": !isActive,
                  })}
                >
                  {isActive ? "ACTIVE" : "INACTIVE"}{" "}
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
    );
  };

  return (
    <>
      {location.pathname === "/products" ? (
        <>
          {error && (
            <Alert variant="danger" className="m-5">
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
                {products?.products?.length > 0 ? (
                  <Page>
                    <div className="d-flex justify-content-between align-items-center">
                      <Headings text="Products" size="1.5rem" />
                      <Badge pill bg="dark" text="light" className="p-2">
                        <Link to="/products/add">
                          <BiPlus />
                          ADD
                        </Link>
                      </Badge>
                    </div>
                    <ShowProducts />
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
                  <NoProducts />
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
