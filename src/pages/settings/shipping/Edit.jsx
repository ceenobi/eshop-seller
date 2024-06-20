import { shippingService } from "@/api";
import {
  ActionButton,
  AuthFormInput,
  CardBox,
  Headings,
  ModalView,
  Page,
  Texts,
} from "@/components";
import { useAuth, useFetch, useTitle } from "@/hooks";
import { country, state, tryCatchFn, validateFields } from "@/utils";
import { useEffect, useMemo, useState } from "react";
import { Alert, Col, Form, Row, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { IoMdArrowBack } from "react-icons/io";
import { RiErrorWarningLine } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function EditShipping() {
  const [modalShow, setModalShow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { shippingId } = useParams();
  const { token, merchant } = useAuth();
  const { error, loading, data } = useFetch(
    shippingService.getShipping,
    merchant.merchantCode,
    shippingId
  );
  const shippingDetail = useMemo(() => data, [data]);
  useTitle(`Edit shipping fee ${shippingDetail?.state}`);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (shippingDetail) {
      setValue("state", shippingDetail?.state);
      setValue("country", shippingDetail?.country);
      setValue("amount", shippingDetail?.amount);
    }
  }, [shippingDetail, setValue]);

  const deleteAShippingFee = tryCatchFn(async () => {
    setIsDeleting(true);
    const { status, data } = await shippingService.deleteShipping(
      merchant.merchantCode,
      shippingId,
      token
    );
    if (status === 200) {
      toast.success(data.msg);
      window.location.replace("/shipping");
    }
    setIsDeleting(false);
  });

  const onUpdateShipping = tryCatchFn(async (credentials) => {
    const { status, data } = await shippingService.updateShipping(
      merchant.merchantCode,
      shippingId,
      credentials,
      token
    );
    if (status === 200) {
      toast.success(data.msg);
      window.location.replace("/shipping");
    }
  });

  return (
    <Page>
      <Texts
        text={
          <>
            <IoMdArrowBack />
            Shipping
          </>
        }
        size="16px"
        className="fw-bold mb-5 cursor"
        onClick={() => navigate("/shipping")}
      />
      <Headings text="Edit Shipping Fee" size="1.5rem" />
      {error && <Alert variant="danger">{error?.response?.data?.error}</Alert>}
      {loading && (
        <div className="d-flex justify-content-center mb-2">
          <Spinner animation="grow" size="sm" />
        </div>
      )}
      <Form className="mt-4 mx-auto" onSubmit={handleSubmit(onUpdateShipping)}>
        <Row>
          <Col md={7} lg={7} xl={8}>
            <CardBox>
              <Texts text="DETAIL" size="12px" className="fw-bold" />
              <Form.Group controlId={"state"} className="w-100 mb-3">
                <Form.Select
                  aria-label="Default select state"
                  {...register("state", validateFields?.state)}
                  defaultValue={""}
                  isInvalid={!!errors.state}
                  style={{ height: "57px" }}
                >
                  {state?.map((item, i) => (
                    <option
                      value={i === 0 ? "" : item.code}
                      key={item.id}
                      disabled={i === 0}
                    >
                      {item.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid" className="text-start">
                  {errors?.state?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId={"country"} className="w-100 mb-3">
                <Form.Select
                  aria-label="Default select country"
                  {...register("country", validateFields.country)}
                  isInvalid={!!errors.country}
                  defaultValue={""}
                  style={{ height: "57px" }}
                >
                  {country?.map((item, i) => (
                    <option
                      value={i === 0 ? "" : item.code}
                      key={item.id}
                      disabled={i === 0}
                    >
                      {item.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid" className="text-start">
                  {errors?.country?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <AuthFormInput
                type="number"
                id="amount"
                name="amount"
                label="Amount"
                register={register}
                validateFields={validateFields?.amount}
                errors={errors.amount}
                placeholder="Enter amount"
                className="mb-3 w-100"
              />
            </CardBox>
          </Col>
          <Col md={5} lg={5} xl={4}>
            <CardBox>
              <ActionButton
                text="Save changes"
                pending={isSubmitting}
                className="w-100 mt-3"
                style={{ backgroundColor: "var(--bg-teal-600)" }}
                disabled={isSubmitting}
                type="submit"
              />
            </CardBox>
            <CardBox>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Texts className="fw-bold" text="DELETE TAX" size="12px" />
                <Texts
                  className="bg-danger text-white p-2 fw-bold cursor"
                  size="12px"
                  role="button"
                  onClick={() => setModalShow(true)}
                  text="DELETE SHIPPING FEE"
                />
              </div>
              <div className="d-flex gap-2 border border-warning bg-warning-subtle rounded-3 p-2">
                <RiErrorWarningLine className="text-danger" size="30px" />
                <Texts
                  text=" Deleting your shipping fee will remove it from total fee at checkout."
                  size="14px"
                  className="fw-medium"
                />
              </div>
            </CardBox>
          </Col>
        </Row>
      </Form>
      <ModalView
        show={modalShow}
        handleClose={() => setModalShow(false)}
        title="Delete shipping fee"
        backdrop="static"
      >
        <Texts
          text="You are about to permanently delete this shipping fee"
          className="fw-bold"
        />
        <Texts text="Deleting your shipping fee is permanent and cannot be reversed. Are you sure?" />
        <div className="d-flex justify-content-end align-items-center gap-3">
          <Texts
            text="Cancel"
            className="fw-bold cursor mt-3"
            role="button"
            onClick={() => setModalShow(false)}
          />
          <ActionButton
            text="DELETE SHIPPING"
            pending={isDeleting}
            size="sm"
            style={{
              fontSize: "14px",
              width: "170px",
              backgroundColor: "var(--bg-sky-950)",
            }}
            onClick={deleteAShippingFee}
          />
        </div>
      </ModalView>
    </Page>
  );
}
