import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ActionButton,
  CardBox,
  Headings,
  ModalView,
  Page,
  Texts,
} from "@/components";
import { customerService } from "@/api";
import { useAuth, useFetch } from "@/hooks";
import React, { useMemo, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { Alert, Badge, Col, Image, Row, Spinner, Table } from "react-bootstrap";
import { formatCurrency, formatDate, tryCatchFn } from "@/utils";
import { format } from "timeago.js";
import { toast } from "react-toastify";

export default function CustomerOrders() {
  const [modalShow, setModalShow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { username } = useParams();
  const { merchant, token } = useAuth();
  const { error, data, loading } = useFetch(
    customerService.getACustomer,
    merchant?.merchantCode,
    username
  );
  const customerDetails = useMemo(() => data, [data]);
  console.log(customerDetails);
  const navigate = useNavigate();
  const { customer, customerOrders } = customerDetails;

  const deleteCustomer = tryCatchFn(async () => {
    setIsDeleting(true);
    const { status, data } = await customerService.deleteACustomer(
      merchant.merchantCode,
      username,
      token
    );
    if (status === 200) {
      toast.success(data.msg);
      setModalShow(false);
      window.location.replace("/customers");
    }
    setIsDeleting(false);
  });

  return (
    <Page>
      <Texts
        text={
          <>
            <IoMdArrowBack />
            Customers
          </>
        }
        size="16px"
        className="fw-bold mb-5 cursor"
        onClick={() => navigate("/customers")}
      />
      <Headings text="Customer overview" size="1.5rem" />
      {error && (
        <Alert variant="danger" className="m-5">
          {error?.response?.data?.error || error.message}
        </Alert>
      )}
      {loading && (
        <div className="d-flex justify-content-center mb-2">
          <Spinner animation="grow" size="sm" />
        </div>
      )}
      {customer && (
        <Row>
          <Col md={7} xl={8}>
            <CardBox>
              <div className="d-flex gap-2 align-items-center mb-4">
                <Image
                  src={customer?.photo}
                  alt={customer?.username}
                  style={{ width: "45px", height: "45px" }}
                  className="object-fit-cover"
                  roundedCircle
                />
                <div>
                  <Texts
                    text={customer?.username}
                    size="16px"
                    className="fw-bold mb-0"
                  />
                  <a
                    href={`mailto:${customer?.email}`}
                    className="text-success"
                  >
                    {customer?.email}
                  </a>
                </div>
              </div>
              <div className="bg-secondary-subtle rounded-3 p-3">
                <div className="d-flex justify-content-between">
                  <div className="text-center">
                    <Texts
                      text="LAST ORDER"
                      size="12px"
                      className="fw-semibold mb-0"
                    />
                    <Texts
                      text={formatDate(customer?.updatedAt)}
                      size="16px"
                      className="fw-bold mb-0"
                    />
                  </div>
                  <div className="text-center">
                    <Texts
                      text="TOTAL SPENT"
                      size="12px"
                      className="fw-semibold mb-0"
                    />
                    <Texts
                      text={formatCurrency(
                        merchant?.currency,
                        customer?.totalSpent
                      )}
                      size="16px"
                      className="fw-bold mb-0 text-success"
                    />
                  </div>
                  <div className="text-center">
                    <Texts
                      text="TOTAL ORDERS"
                      size="12px"
                      className="fw-semibold mb-0"
                    />
                    <Texts
                      text={customer?.totalOrders}
                      size="16px"
                      className="fw-bold mb-0"
                    />
                  </div>
                </div>
                <hr />
                <Texts
                  text={
                    <>
                      CREATED: <b>{formatDate(customer?.createdAt)}</b> @{" "}
                      {format(customer?.createdAt)}
                    </>
                  }
                  size="12px"
                  className="fw-semibold text-uppercase text-center"
                />
              </div>
            </CardBox>
            <CardBox>
              <Texts
                text="RECENT ORDER"
                size="12px"
                className="fw-semibold mb-1"
              />
              {customerOrders && customerOrders.length > 0 && (
                <div className="bg-secondary-subtle p-3 rounded-3">
                  <div className="d-flex justify-content-between align-items-cente">
                    <Link to={`/orders/${customerOrders[0]?._id}`}>
                      <Badge bg="secondary" text="light">
                        {customerOrders[0]?._id}
                      </Badge>
                    </Link>
                    <Texts
                      text={`${customerOrders[0]?.orderItems?.length} Item(s)`}
                      size="14px"
                      className="fw-medium mb-3"
                    />
                    <Texts
                      text={
                        <>
                          Payment:{" "}
                          <b>
                            {customerOrders[0]?.isPaid ? "Paid" : "Not Paid"}
                          </b>
                        </>
                      }
                      size="14px"
                      className="fw-medium mb-3"
                    />
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <Texts
                        text={
                          customerOrders[0]?.isPaid
                            ? "TOTAL PAID"
                            : "OUTSTANDING"
                        }
                        size="12px"
                        className="fw-semibold mb-0"
                      />
                      <Texts
                        text={formatCurrency(
                          merchant?.currency,
                          customerOrders[0]?.total
                        )}
                        size="16px"
                        className={`fw-bold mb-0 ${
                          customerOrders[0]?.isPaid
                            ? "text-success"
                            : "text-danger"
                        }`}
                      />
                    </div>
                    <Link to={`/orders/${customerOrders[0]?._id}`}>
                      <Badge pill bg="dark" text="light" className="p-2" role="button">
                        VIEW ORDER
                      </Badge>
                    </Link>
                  </div>
                </div>
              )}
            </CardBox>
            <CardBox>
              <Texts
                text="ORDER HISTORY"
                size="12px"
                className="fw-semibold mb-1"
              />
              {customerOrders && customerOrders.length > 0 ? (
                <Table hover striped bordered responsive className="shadow-sm">
                  <thead>
                    <tr className="small">
                      <th>ORDER ID</th>
                      <th>DATE</th>
                      <th>STATUS</th>
                      <th>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerOrders?.map(
                      ({ _id, createdAt, orderStatus, isPaid, total }) => (
                        <React.Fragment key={_id}>
                          <tr
                            key={_id}
                            className="small cursor fw-medium"
                            onClick={() => navigate(`/orders/${_id}`)}
                            title="click to view"
                          >
                            <td>{_id}</td>
                            <td>{formatDate(createdAt)}</td>
                            <td
                              className={`text-uppercase font-semibold ${
                                orderStatus !== "fulfilled"
                                  ? "text-warning"
                                  : "text-success"
                              }`}
                            >
                              {orderStatus}
                            </td>
                            <td
                              className={`${
                                isPaid ? "text-success" : "text-danger"
                              } fw-semibold`}
                            >
                              {formatCurrency(merchant?.currency, total)}
                            </td>
                          </tr>
                        </React.Fragment>
                      )
                    )}
                  </tbody>
                </Table>
              ) : (
                <Texts text="No order history found" className="mt-3" />
              )}
            </CardBox>
          </Col>
          <Col md={5} xl={4}>
            <CardBox>
              <Texts
                text="DELETE CUSTOMER"
                size="14px"
                className="fw-semibold mb-2"
              />
              <Texts
                text="This action cannot be undone"
                size="14px"
                className="mb-2"
              />
              <ActionButton
                text="DELETE"
                size="sm"
                variant="danger"
                onClick={() => setModalShow(true)}
              />
            </CardBox>
          </Col>
        </Row>
      )}
      <ModalView
        show={modalShow}
        handleClose={() => setModalShow(false)}
        title="Delete customer"
        backdrop="static"
      >
        <Texts
          text="You are about to permanently delete this customer."
          className="fw-bold"
        />
        <Texts text="Deleting this customer is permanent and cannot be reversed. Are you sure?" />
        <div className="d-flex justify-content-end align-items-center gap-3">
          <Texts
            text="Cancel"
            className="fw-bold cursor mt-3"
            role="button"
            onClick={() => setModalShow(false)}
          />
          <ActionButton
            text="DELETE CUSTOMER"
            pending={isDeleting}
            size="sm"
            style={{
              fontSize: "14px",
              width: "170px",
              backgroundColor: "var(--bg-sky-950)",
            }}
            onClick={deleteCustomer}
          />
        </div>
      </ModalView>
    </Page>
  );
}
