import { discountService } from "@/api";
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
import { useParams, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { Form, Row, Col, Badge, Alert } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { generateDiscountCode, tryCatchFn, validateFields } from "@/utils";
import { toast } from "react-toastify";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import { RiErrorWarningLine } from "react-icons/ri";

export default function Edit() {
  const [modalShow, setModalShow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { discountId } = useParams();
  const { merchant, token } = useAuth();
  const navigate = useNavigate();
  const { error, data: discountDetails } = useFetch(
    discountService.getADiscount,
    merchant.merchantCode,
    discountId
  );
  useTitle("Edit Discount");
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const generateCODE = () => {
    const getCode = generateDiscountCode();
    setValue("discountCode", getCode);
  };

  const formatEditDate = (date) => {
    if (date) {
      const formattedDate = new Date(date);
      if (!isNaN(formattedDate)) {
        return formattedDate.toISOString().split("T")[0];
      }
    }
    return null; // or any default value you prefer
  };

  useEffect(() => {
    setValue("discountCode", discountDetails?.discountCode);
    setValue("discountValue", discountDetails?.discountValue);
    setValue("quantity", discountDetails?.quantity);
    setValue("startDate", formatEditDate(discountDetails?.startDate));
    setValue("endDate", formatEditDate(discountDetails?.endDate));
    setValue("enabled", discountDetails?.enabled);
  }, [discountDetails, setValue]);

  const deleteADiscount = tryCatchFn(async () => {
    setIsDeleting(true);
    const { status, data } = await discountService.deleteDiscount(
      merchant.merchantCode,
      discountId,
      token
    );
    if (status === 200) {
      toast.success(data.msg);
      setModalShow(false);
      window.location.replace("/discounts");
    }
    setIsDeleting(false);
  });

  const onFormSubmit = tryCatchFn(async (credentials) => {
    const { status, data } = await discountService.updateDiscount(
      merchant.merchantCode,
      discountId,
      credentials,
      token
    );
    if (status === 200) {
      toast.success(data.msg);
      window.location.replace("/discounts");
    }
  });

  return (
    <Page>
      <Texts
        text={
          <>
            <IoMdArrowBack />
            Discounts
          </>
        }
        size="16px"
        className="fw-bold mb-5 cursor"
        onClick={() => navigate("/discounts")}
      />
      <Headings text="Edit Discount" size="1.5rem" />
      {error && <Alert variant="danger">{error?.response?.data?.error}</Alert>}
      <Form className="mt-4 mx-auto" onSubmit={handleSubmit(onFormSubmit)}>
        <Row>
          <Col md={6} lg={7} xl={8}>
            <CardBox>
              <Texts text="DETAILS" size="12px" className="fw-bold" />
              <div className="position-relative">
                <AuthFormInput
                  type="text"
                  id="discountCode"
                  name="discountCode"
                  label="Discount Code"
                  register={register}
                  validateFields={validateFields?.discountCode}
                  errors={errors.discountCode}
                  placeholder="Enter discount code"
                  className="mb-3 w-100"
                />
                <Badge
                  bg="dark"
                  text="light"
                  className="p-2 position-absolute top-50 end-0 translate-middle cursor"
                  role="button"
                  onClick={generateCODE}
                >
                  REGENERATE
                </Badge>
              </div>
              <div className="mt-3 d-xl-flex gap-2">
                <AuthFormInput
                  type="text"
                  id="discountValue"
                  name="discountValue"
                  label="Discount Value(%)"
                  register={register}
                  validateFields={validateFields?.discountValue}
                  errors={errors.discountValue}
                  placeholder="Enter discount value"
                  className="mb-3 w-100"
                />
                <AuthFormInput
                  type="number"
                  id="quantity"
                  name="quantity"
                  label="Quantity"
                  register={register}
                  placeholder="Enter quantity"
                  className="mb-3 w-100"
                />
              </div>
              <div className="mt-3 d-xl-flex gap-2">
                <AuthFormInput
                  type="date"
                  id="startDate"
                  name="startDate"
                  label="Start date"
                  register={register}
                  placeholder="Enter start date"
                  className="mb-3 w-100"
                />
                <AuthFormInput
                  type="date"
                  id="endDate"
                  name="endDate"
                  label="Expires"
                  register={register}
                  placeholder="Enter end date"
                  className="mb-3 w-100"
                />
              </div>
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
              <div className="mt-3 d-flex gap-3">
                <Controller
                  name="enabled"
                  control={control}
                  render={({ field }) => (
                    <div className="mt-3 d-flex gap-3">
                      {field.value ? (
                        <FaToggleOn
                          size="25px"
                          onClick={() => field.onChange(false)}
                          className="cursor text-success"
                        />
                      ) : (
                        <FaToggleOff
                          size="25px"
                          onClick={() => field.onChange(true)}
                          className="cursor"
                        />
                      )}
                      <span className="fw-bold small">
                        {field.value ? "DISCOUNT ENABLED" : "DISCOUNT DISABLED"}
                      </span>
                    </div>
                  )}
                />
              </div>
            </CardBox>
            <CardBox>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Texts className="fw-bold" text="DELETE DISCOUNT" size="12px" />
                <Texts
                  className="bg-danger text-white p-2 fw-bold cursor"
                  size="12px"
                  role="button"
                  onClick={() => setModalShow(true)}
                  text="DELETE DISCOUNT"
                />
              </div>
              <div className="d-flex gap-2 border border-warning bg-warning-subtle rounded-3 p-2">
                <RiErrorWarningLine className="text-danger" size="30px" />
                <Texts
                  text=" Deleting this discount will remove it from all products it is active on."
                  size="14px"
                  className="fw-medium"
                />
              </div>
            </CardBox>
          </Col>
        </Row>
      </Form>{" "}
      <ModalView
        show={modalShow}
        handleClose={() => setModalShow(false)}
        title="Delete discount"
        backdrop="static"
      >
        <Texts
          text="You are about to permanently delete this discount."
          className="fw-bold"
        />
        <Texts text="Deleting this discount is permanent and cannot be reversed. Are you sure?" />
        <div className="d-flex justify-content-end align-items-center gap-3">
          <Texts
            text="Cancel"
            className="fw-bold cursor mt-3"
            role="button"
            onClick={() => setModalShow(false)}
          />
          <ActionButton
            text="DELETE DISCOUNT"
            pending={isDeleting}
            size="sm"
            style={{
              fontSize: "14px",
              width: "170px",
              backgroundColor: "var(--bg-sky-950)",
            }}
            onClick={deleteADiscount}
          />
        </div>
      </ModalView>
    </Page>
  );
}
