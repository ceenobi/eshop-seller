import {
  ActionButton,
  AuthFormInput,
  CardBox,
  Headings,
  Page,
  Texts,
} from "@/components";
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { Alert, Badge, Col, Form, Row } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { generateDiscountCode, tryCatchFn, validateFields } from "@/utils";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import { useAuth, useFetch, useTitle } from "@/hooks";
import { discountService, productService } from "@/api";
import { toast } from "react-toastify";
import { useMemo, useState } from "react";

export default function Add() {
  useTitle("Add Discount");
  const [products, setProducts] = useState([]);
  const { merchant, token } = useAuth();
  const navigate = useNavigate();
  const { error, data } = useFetch(
    productService.getAllProducts,
    merchant?.merchantCode
  );
  const product = useMemo(() => data, [data]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      discountCode: "",
    },
  });

  const generateCODE = () => {
    const getCode = generateDiscountCode();
    setValue("discountCode", getCode);
  };
  // Update the discountCode field whenever the code state changes
  // useEffect(() => {
  //   setValue("discountCode", code);
  // }, [code, setValue]);

  const addProduct = (id, index) => {
    if (!products.includes(id)) {
      setProducts(products, products.push(id));
    } else {
      const newProducts = [...products];
      newProducts.splice(index, 1);
      setProducts(newProducts);
    }
  };

  const onFormSubmit = tryCatchFn(async (credentials) => {
    const formData = {
      discountCode: credentials.discountCode,
      discountValue: credentials.discountValue,
      quantity: credentials.quantity,
      startDate: credentials.startDate,
      endDate: credentials.endDate,
      enabled: credentials.enabled,
      products: products,
    };
    console.log(formData);
    const { status, data } = await discountService.createDiscount(
      merchant.merchantCode,
      formData,
      token
    );
    if (status === 201) {
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
        onClick={() => navigate(-1)}
      />
      <Headings text="Add Discount" size="1.5rem" />
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
                  GENERATE
                </Badge>
              </div>
              <div className="mt-3 d-xl-flex gap-2">
                <AuthFormInput
                  type="number"
                  id="discountValue"
                  name="discountValue"
                  label="Discount Value(%)"
                  register={register}
                  validateFields={validateFields?.discountValue}
                  errors={errors.discountValue}
                  placeholder="Enter discount value"
                  className="mb-0 w-100"
                />
                <AuthFormInput
                  type="number"
                  id="quantity"
                  name="quantity"
                  label="Quantity"
                  register={register}
                  placeholder="Enter quantity"
                  className="mb-0 w-100"
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
                  className="mb-0 w-100"
                />
                <AuthFormInput
                  type="date"
                  id="endDate"
                  name="endDate"
                  label="Expires"
                  register={register}
                  placeholder="Enter end date"
                  className="mb-0 w-100"
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
                          role="button"
                        />
                      ) : (
                        <FaToggleOff
                          size="25px"
                          onClick={() => field.onChange(true)}
                          className="cursor"
                          role="button"
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
              <Texts
                text="Select product for discount"
                size="14px"
                className="fw-bold"
              />
              {error && (
                <Alert variant="danger" className="m-5">
                  {error?.response?.data?.error}
                </Alert>
              )}
              <div style={{ height: "250px" }} className="overflow-scroll">
                <Form.Group controlId={"selectDiscount"}>
                  {product?.products?.map((item, i) => (
                    <Form.Check
                      key={item._id}
                      type="checkbox"
                      id={`${item._id}`}
                      label={`${item.name.toLowerCase()}`}
                      className="small"
                      onClick={() => addProduct(item._id, i)}
                    />
                  ))}
                </Form.Group>
              </div>
            </CardBox>
          </Col>
        </Row>
      </Form>
    </Page>
  );
}
