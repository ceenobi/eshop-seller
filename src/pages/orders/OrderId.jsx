import { orderService } from "@/api";
import { ActionButton, CardBox, ModalView, Page, Texts } from "@/components";
import { useAuth, useFetch, useTitle } from "@/hooks";
import { formatCurrency, formatDate, orderProgress, tryCatchFn } from "@/utils";
import React, { useMemo, useState } from "react";
import { Alert, Badge, Col, Row, Spinner } from "react-bootstrap";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "timeago.js";
import { LazyLoadImage } from "react-lazy-load-image-component";
import classnames from "classnames";
import { GrMoney } from "react-icons/gr";
import { TbTruckDelivery } from "react-icons/tb";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { toast } from "react-toastify";

export default function OrderId() {
  const [modalShow, setModalShow] = useState(false);
  const [orderStatus, setOrderStatus] = useState("open");
  const [isUpdating, setIsUpdating] = useState(false);
  const { orderId } = useParams();
  useTitle(`Order id - ${orderId}`);
  const navigate = useNavigate();
  const { merchant, token } = useAuth();
  const { error, data, loading, setData } = useFetch(
    orderService.getAnOrder,
    merchant.merchantCode,
    orderId
  );
  const orderDetail = useMemo(() => data, [data]);
  const [isPaid, setIsPaid] = useState(orderDetail.isPaid);
  const [isDelivered, setIsDelivered] = useState(orderDetail.isDelivered);

  const updateOrder = tryCatchFn(async () => {
    const credentials = {
      orderStatus,
      isPaid,
      isDelivered,
    };
    setIsUpdating(true);
    const { status, data } = await orderService.updateAnOrderStatus(
      merchant.merchantCode,
      orderId,
      credentials,
      token
    );
    if (status === 200) {
      toast.success(data.msg);
      setModalShow(false);
      setData(data.updatedOrder);
    }
    setIsUpdating(false);
  });

  return (
    <>
      <Page>
        <Texts
          text={
            <>
              <IoMdArrowBack />
              Orders
            </>
          }
          size="16px"
          className="fw-bold mb-5 cursor"
          onClick={() => navigate("/orders")}
        />
        {error && (
          <Alert variant="danger" className="mt-5">
            {error?.response?.data?.error || error.message}
          </Alert>
        )}
        {loading && (
          <div className="d-flex justify-content-center mb-2">
            <Spinner animation="grow" size="sm" />
          </div>
        )}
        {orderDetail && (
          <Row>
            <Col lg={7} xl={8}>
              <CardBox>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Texts text="DETAILS" size="12px" className="fw-bold" />
                  <Badge
                    pill
                    bg="dark"
                    text="light"
                    className="p-2 cursor"
                    role="button"
                    onClick={() => setModalShow(true)}
                  >
                    UPDATE ORDER
                  </Badge>
                </div>
                <div className="d-flex flex-wrap justify-content-between align-items-center border rounded-3 px-3 py-2">
                  <div className="mt-2">
                    <Texts
                      text="REFERENCE"
                      size="12px"
                      className="fw-bold mb-1"
                    />
                    <Texts
                      text={
                        orderDetail?.reference
                          ? orderDetail?.reference
                          : orderDetail?._id
                      }
                      size="14px"
                      className="fw-semibold text-uppercase"
                    />
                  </div>
                  <div className="mt-2">
                    <Texts text="PLACED" size="12px" className="fw-bold mb-1" />
                    <Texts
                      text={
                        <>
                          {formatDate(orderDetail?.createdAt)}
                          &nbsp;@&nbsp;{format(orderDetail?.createdAt)}
                        </>
                      }
                      size="12px"
                      className="fw-semibold text-uppercase"
                    />
                  </div>
                </div>
                <Row className="rounded-3 mt-4 mx-0 py-2 border">
                  {orderDetail?.orderItems?.map((item) => (
                    <React.Fragment key={item._id}>
                      <Col md={6}>
                        <Texts text="ITEM" size="12px" className="fw-bold" />
                        <div className="d-flex gap-3 align-items-center">
                          <LazyLoadImage
                            effect="blur"
                            src={item?.image[0]}
                            alt={item?.name}
                            width={50}
                            height={50}
                            className="object-fit-cover"
                          />
                          <Texts
                            text={item.name}
                            size="12px"
                            className="fw-bold"
                          />
                        </div>
                      </Col>
                      <Col md={3}>
                        <Texts
                          text="QUANTITY"
                          size="12px"
                          className="fw-bold"
                        />
                        <Texts
                          text={item.quantity}
                          size="12px"
                          className="fw-semibold"
                        />
                      </Col>
                      <Col md={3} className="text-md-end">
                        <Texts text="AMOUNT" size="12px" className="fw-bold" />
                        <Texts
                          text={formatCurrency(
                            merchant?.currency,
                            item.price ? item.price : 0
                          )}
                          size="12px"
                          className={`fw-semibold ${
                            orderDetail.isPaid !== true
                              ? "text-danger"
                              : "text-success"
                          }`}
                        />
                      </Col>
                    </React.Fragment>
                  ))}
                </Row>
                <div className="rounded-3 my-4 py-2 px-3 border">
                  <div className="d-flex justify-content-between">
                    <Texts text="Subtotal" size="15px" className="fw-bold" />
                    <Texts
                      text={formatCurrency(
                        merchant?.currency,
                        orderDetail?.subTotal
                      )}
                      size="15px"
                      className="fw-medium"
                    />
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <Texts
                      text="Shipping Fee"
                      size="15px"
                      className="fw-bold"
                    />
                    <Texts
                      text={formatCurrency(
                        merchant?.currency,
                        orderDetail?.shippingFee
                      )}
                      size="15px"
                      className="fw-medium"
                    />
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <Texts text="Discount" size="15px" className="fw-bold" />
                    <Texts
                      text={formatCurrency(
                        merchant?.currency,
                        orderDetail?.discount
                      )}
                      size="15px"
                      className="fw-medium"
                    />
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <Texts text="Tax" size="15px" className="fw-bold" />
                    <Texts
                      text={formatCurrency(
                        merchant?.currency,
                        orderDetail?.taxPrice
                      )}
                      size="15px"
                      className="fw-medium"
                    />
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <Texts text="Total" size="15px" className="fw-bold" />
                    <Texts
                      text={formatCurrency(
                        merchant?.currency,
                        orderDetail?.total
                      )}
                      size="15px"
                      className={`fw-bold ${
                        orderDetail.isPaid !== true
                          ? "text-danger"
                          : "text-success"
                      }`}
                    />
                  </div>
                </div>
              </CardBox>
              <CardBox>
                <div className="bg-secondary-subtle d-flex flex-wrap justify-content-between align-items-center border rounded-3 px-3 py-2">
                  <div className="mt-2">
                    <Texts
                      text="PAID AT"
                      size="12px"
                      className="fw-bold text-black mb-1"
                    />
                    <Texts
                      text={
                        orderDetail?.paidAt
                          ? formatDate(orderDetail?.paidAt)
                          : "Not paid"
                      }
                      size="12px"
                      className="fw-semibold text-uppercase"
                    />
                  </div>
                  <div className="mt-2">
                    <Texts
                      text="DELIVERED AT"
                      size="12px"
                      className="fw-bold text-success mb-1"
                    />
                    <Texts
                      text={
                        orderDetail?.deliveredAt ? (
                          <>
                            {formatDate(orderDetail?.deliveredAt)}
                            &nbsp;@&nbsp;{format(orderDetail?.deliveredAt)}
                          </>
                        ) : (
                          "Not delivered"
                        )
                      }
                      size="12px"
                      className="fw-semibold text-uppercase"
                    />
                  </div>
                </div>
              </CardBox>
            </Col>
            <Col lg={5} xl={4}>
              <CardBox>
                <div className="d-flex justify-content-between mb-0">
                  <Texts
                    text="Order status"
                    size="15px"
                    className="fw-bold mb-0"
                  />
                  <Texts
                    text={orderDetail?.orderStatus}
                    size="12px"
                    className={classnames({
                      "fw-bold rounded-4 text-uppercase text-white text-center p-2 mb-0": true,
                      "bg-warning": orderDetail?.orderStatus === "open",
                      "bg-info": orderDetail?.orderStatus === "processing",
                      "bg-success": orderDetail?.orderStatus === "fulfilled",
                    })}
                    width="125px"
                  />
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-0">
                  <Texts
                    text="Delivery status"
                    size="15px"
                    className="fw-bold mb-0"
                  />
                  <Texts
                    text={
                      orderDetail?.isDelivered ? "Delivered" : "Not Delivered"
                    }
                    size="12px"
                    className={`fw-bold rounded-4 text-uppercase text-white text-center p-2 mb-0 ${
                      orderDetail?.isDelivered ? "bg-success" : "bg-warning"
                    }`}
                    width="125px"
                  />
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-0">
                  <Texts
                    text="Payment status"
                    size="15px"
                    className="fw-bold mb-0"
                  />
                  <Texts
                    text={orderDetail?.isPaid ? "paid" : "not paid"}
                    size="12px"
                    className={`fw-bold rounded-4 text-uppercase text-white text-center p-2 mb-0 ${
                      orderDetail?.isPaid ? "bg-success" : "bg-warning"
                    }`}
                    width="125px"
                  />
                </div>
              </CardBox>
              <CardBox>
                <Texts
                  text="Payment method"
                  size="12px"
                  className="fw-bold text-uppercase"
                />
                <Texts
                  text={orderDetail?.paymentMethod}
                  size="15px"
                  className="fw-bold text-uppercase"
                />
              </CardBox>
              <CardBox>
                <Texts
                  text="Shipping address"
                  size="12px"
                  className="fw-bold text-uppercase"
                />
                <Texts text="Details" size="15px" className="fw-bold mb-0" />
                <Texts
                  text={
                    <>
                      {orderDetail?.shippingDetails?.address}
                      <br />
                      {orderDetail?.shippingDetails?.state}
                      <br />
                      {orderDetail?.shippingDetails?.country}
                    </>
                  }
                  size="15px"
                  className="fw-medium"
                />
              </CardBox>
              <CardBox>
                <Texts
                  text="Customer details"
                  size="12px"
                  className="fw-bold text-uppercase"
                />
                <Texts
                  text={
                    <>
                      <b>{orderDetail?.shippingDetails?.fullname}</b>
                      <br />
                      {orderDetail?.shippingDetails?.phone}
                    </>
                  }
                  size="15px"
                  className="fw-medium"
                />
              </CardBox>
            </Col>
          </Row>
        )}
      </Page>
      <ModalView
        show={modalShow}
        handleClose={() => setModalShow(false)}
        title="Update order"
        backdrop="static"
      >
        <div className="bg-secondary-subtle p-3 rounded-3">
          <Texts
            text="Order status"
            size="12px"
            className="fw-bold text-uppercase"
          />
          <div className="d-flex flex-wrap justify-content-between align-items-center small text-center">
            <div>
              <BsFillInfoSquareFill size="1.8rem" />
              <Texts
                text={orderDetail.orderStatus}
                size="14px"
                className={classnames({
                  "fw-bold text-uppercase": true,
                  "text-warning": orderDetail.orderStatus === "open",
                  "text-info": orderDetail.orderStatus === "processing",
                  "text-success": orderDetail.orderStatus === "fulfilled",
                })}
              />
            </div>
            <div className="d-flex gap-4 align-items-center">
              {orderProgress.map(({ id, Icon, name }) => (
                <div
                  key={id}
                  className={classnames({
                    "fw-semibold cursor": true,
                    "orderIcon p-1 rounded-3 text-uppercase fw-bold":
                      orderStatus === name,
                    "text-success p-1 rounded-3 text-uppercase fw-bold":
                      orderDetail.orderStatus === name,
                  })}
                  onClick={() => setOrderStatus(name)}
                >
                  <Icon size="1.8rem" />
                  <Texts text={name} size="12px" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <hr />
        <div className="bg-secondary-subtle p-3 rounded-3 d-flex justify-content-between align-items-center">
          <div>
            <Texts
              text="Payment status"
              size="12px"
              className="fw-bold text-uppercase"
            />
            <div>
              <GrMoney size="1.8rem" />
              <Texts
                text={orderDetail.isPaid ? "Paid" : "Not Paid"}
                size="14px"
                className={`fw-bold text-uppercase ${
                  orderDetail.isPaid ? "text-success" : "text-danger"
                }`}
              />
            </div>
          </div>
          <div className="text-center">
            <Texts
              text="TOGGLE STATUS"
              size="12px"
              className="fw-bold mb-2 text-uppercase"
            />
            <div>
              <ActionButton
                text={isPaid ? "Paid" : "Not Paid"}
                size="sm"
                className={classnames({
                  "fw-bold cursor p-2 rounded-2 text-white mx-auto": true,
                  "bg-success": isPaid,
                  "bg-danger": !isPaid,
                })}
                style={{ width: "110px" }}
                onClick={() => setIsPaid((prev) => !prev)}
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="bg-secondary-subtle p-3 rounded-3 d-flex justify-content-between align-items-center">
          <div>
            <Texts
              text="Delivery status"
              size="12px"
              className="fw-bold text-uppercase"
            />
            <div>
              <TbTruckDelivery size="1.8rem" />
              <Texts
                text={orderDetail.isDelivered ? "Delivered" : "Not Delivered"}
                size="14px"
                className={`fw-bold text-uppercase ${
                  orderDetail.isDelivered ? "text-success" : "text-danger"
                }`}
              />
            </div>
          </div>
          <div className="text-center">
            <Texts
              text="TOGGLE STATUS"
              size="12px"
              className="fw-bold mb-2 text-uppercase"
            />
            <div>
              <ActionButton
                text={isDelivered ? "Delivered" : "Not Delivered"}
                size="sm"
                className={classnames({
                  "fw-bold cursor p-2 rounded-2 text-white mx-auto": true,
                  "bg-success": isDelivered,
                  "bg-danger": !isDelivered,
                })}
                style={{ width: "110px" }}
                onClick={() => setIsDelivered((prev) => !prev)}
              />
            </div>
          </div>
        </div>
        <div className="mt-3 d-flex justify-content-end align-items-center gap-3">
          <Texts
            text="Cancel"
            className="fw-bold cursor mt-3"
            role="button"
            onClick={() => setModalShow(false)}
          />
          <ActionButton
            text="UPDATE ORDER"
            pending={isUpdating}
            size="sm"
            style={{
              fontSize: "14px",
              width: "170px",
              backgroundColor: "var(--bg-sky-950)",
            }}
            onClick={updateOrder}
          />
        </div>
      </ModalView>
    </>
  );
}
