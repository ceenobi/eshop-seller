import styles from "../pages.module.css";
import { CardBox, Headings, Page, Texts } from "@/components";
import { Badge, Table, Alert, Spinner } from "react-bootstrap";
import { BiPlus } from "react-icons/bi";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth, useFetch, useTitle } from "@/hooks";
import { discountService } from "@/api";
import { formatDate } from "@/utils";
import classNames from "classnames";
import { useMemo } from "react";

export default function Discount() {
  useTitle("Discounts");
  const location = useLocation();
  const navigate = useNavigate();
  const { merchant } = useAuth();
  const { error, data, loading } = useFetch(
    discountService.getAllDiscounts,
    merchant.merchantCode
  );

  const discounts = useMemo(() => data, [data]);

  const ShowDiscounts = () => {
    return (
      <Page>
        <div className="d-flex justify-content-between align-items-center">
          <Headings text="Discounts" size="1.5rem" />
          <Badge pill bg="dark" text="light" className="p-2">
            <Link to="/discounts/add">
              <BiPlus />
              ADD
            </Link>
          </Badge>
        </div>
        <Table
          striped
          hover
          bordered
          responsive
          size="shadow-sm"
          className="mt-5"
        >
          <thead>
            <tr className="small">
              <th>CODE</th>
              <th>VALUE</th>
              <th>START DATE</th>
              <th>EXPIRES</th>
              <th>QTY</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map(
              ({
                _id,
                discountCode,
                discountValue,
                startDate,
                endDate,
                quantity,
                enabled,
              }) => (
                <tr
                  key={_id}
                  className="small align-items-center cursor fw-medium"
                  onClick={() => navigate(`/discounts/${_id}`)}
                >
                  <td>
                    <Badge bg="success" text="light">
                      {discountCode}
                    </Badge>
                  </td>
                  <td>{discountValue} %</td>
                  <td>{startDate ? formatDate(startDate) : "NEVER"}</td>
                  <td>{endDate ? formatDate(endDate) : "NEVER"}</td>
                  <td>{quantity ? quantity : "ALL"}</td>
                  <td
                    className={classNames({
                      "fw-bold": true,
                      "text-success": enabled,
                      "text-info": !enabled,
                    })}
                  >
                    {enabled ? "ACTIVE" : "INACTIVE"}{" "}
                  </td>
                  <td>
                    <Badge
                      bg="danger"
                      text="light"
                      onClick={() => navigate(`/discounts/${_id}`)}
                    >
                      VIEW
                    </Badge>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </Page>
    );
  };

  const NoDiscounts = () => {
    return (
      <div className={`${styles.discountBg}`}>
        <Page>
          <div className="d-flex justify-content-between align-items-center">
            <Headings text="Discounts" size="1.5rem" />
            <Badge pill bg="dark" text="light" className="p-2">
              <Link to="/discounts/add">
                <BiPlus />
                ADD
              </Link>
            </Badge>
          </div>
          <div className="mt-5 d-flex justify-content-center align-items-center">
            <CardBox style={{ maxWidth: "450px" }}>
              <Texts
                text="Add a discount code and run a promotion."
                size="16px"
                className="fw-bold"
              />
              <Texts
                text="Add % based discount codes, their quantity, start and end dates."
                size="14px"
                className="fw-medium"
              />
              <div className="d-flex justify-content-end">
                <Badge pill bg="dark" text="light" className="p-2">
                  <Link to="/discounts/add">
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

  return (
    <>
      {location.pathname === "/discounts" ? (
        <>
          {error ? (
            <Alert variant="danger" className="m-5">
              {error?.response?.data?.error || error.message}
            </Alert>
          ) : (
            <>
              {loading ? (
                <div className="d-flex mt-5 justify-content-center">
                  <Spinner animation="grow" size="sm" />
                </div>
              ) : (
                <>
                  {discounts?.length > 0 ? <ShowDiscounts /> : <NoDiscounts />}
                </>
              )}
            </>
          )}
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
}
