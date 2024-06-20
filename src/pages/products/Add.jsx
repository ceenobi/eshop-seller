import { categoryService, productService } from "@/api";
import {
  ActionButton,
  AuthFormInput,
  CardBox,
  Headings,
  Page,
  Texts,
} from "@/components";
import { useAuth, useFetch, useTitle } from "@/hooks";
import { tryCatchFn, validateFields } from "@/utils";
import { useState } from "react";
import { Form, Row, Col, Badge, Image, Alert, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { FaToggleOn, FaToggleOff, FaCloudUploadAlt } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import SimpleMDE from "react-simplemde-editor";
import { toast } from "react-toastify";

export default function Add() {
  useTitle("Add a product");
  const [selectedImage, setSelectedImage] = useState([]);
  const { merchant, token } = useAuth();
  const {
    error,
    data: categories,
    loading,
  } = useFetch(categoryService.getAllCategories, merchant.merchantCode);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const productNameValue = watch("name");
  const descriptionValue = watch("description");

  function generateSlug() {
    if (!productNameValue) {
      toast.warning("Enter the product name to generate product slug");
      return;
    }
    const getSlug = productNameValue.split(" ").join("-").toLowerCase();
    setValue("slug", getSlug);
  }

  const handleImage = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      if (e.target.files && e.target.files[i]) {
        if (e.target.files[i].size > 2 * 1000 * 1000) {
          toast.error("File with maximum size of 2MB is allowed");
          return false;
        }
        transformImage(e.target.files);
      }
    }
  };

  const transformImage = (files) => {
    let images = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onloadend = () => {
        images.push(reader.result);
        setSelectedImage(images);
        setValue("image", images);
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const onFormSubmit = tryCatchFn(async (credentials) => {
    const { status, data } = await productService.addProduct(
      merchant.merchantCode,
      credentials,
      token
    );
    if (status === 201) {
      toast.success(data.msg);
      window.location.replace("/products");
    }
  });

  return (
    <Page>
      <Texts
        text={
          <>
            <IoMdArrowBack />
            Products
          </>
        }
        size="16px"
        className="fw-bold mb-5 cursor"
        onClick={() => navigate(-1)}
      />
      <Headings text="Add Product" size="1.5rem" />
      <Form className="mt-4 mx-auto" onSubmit={handleSubmit(onFormSubmit)}>
        <Row>
          <Col md={6} lg={7} xl={8}>
            <CardBox>
              <Texts text="DETAILS" size="12px" className="fw-bold" />
              <AuthFormInput
                type="text"
                id="name"
                name="name"
                label="Name (required)"
                register={register}
                validateFields={validateFields?.name}
                errors={errors.name}
                placeholder="Enter category name"
                className="mb-3 w-100"
              />
              <div className="mb-3 d-xl-flex gap-2 align-items-center">
                <div className="position-relative w-100">
                  <AuthFormInput
                    type="text"
                    id="slug"
                    name="slug"
                    label="Slug (required)"
                    register={register}
                    validateFields={validateFields?.slug}
                    errors={errors.slug}
                    placeholder="Enter slug"
                    className="w-100"
                  />
                  <Badge
                    bg="dark"
                    text="light"
                    className="p-2 position-absolute top-50 end-0 translate-middle cursor"
                    role="button"
                    onClick={generateSlug}
                  >
                    GENERATE
                  </Badge>
                </div>
                <AuthFormInput
                  type="text"
                  id="brand"
                  name="brand"
                  label="Brand"
                  register={register}
                  placeholder="Enter brand"
                  className="w-100"
                />
              </div>
              <div className="mb-3">
                <Texts text="DESCRIPTION" size="12px" className="fw-bold" />
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <>
                      <SimpleMDE
                        placeholder="Description"
                        {...field}
                        isInvalid={!!errors}
                      />
                      <Form.Control.Feedback
                        type="invalid"
                        className="text-start"
                      >
                        {!descriptionValue ? "Description is required" : ""}
                      </Form.Control.Feedback>
                    </>
                  )}
                />
              </div>
            </CardBox>
            <CardBox>
              <Texts text="PRICE" size="12px" className="fw-bold" />
              <div className="d-xl-flex gap-4 align-items-center">
                <AuthFormInput
                  type="number"
                  id="price"
                  name="price"
                  label="Price (required)"
                  register={register}
                  validateFields={validateFields?.price}
                  errors={errors.price}
                  placeholder="Enter product price"
                  className="mb-3 w-100"
                />
                <Controller
                  name="inStock"
                  control={control}
                  render={({ field }) => (
                    <div className="d-flex gap-3 w-100">
                      <span className="fw-bold small">
                        {field.value ? "ITEM IN STOCK" : "OUT OF STOCK"}
                      </span>
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
                    </div>
                  )}
                />
              </div>
            </CardBox>
            <CardBox>
              <Texts text="IMAGE GALLERY" size="12px" className="fw-bold" />
              <div className="position-relative rounded-1 bg-secondary-subtle px-4 py-5">
                <div className="d-flex align-items-center justify-content-center gap-2 bg-white p-3 shadow-sm w-50 mx-auto">
                  <FaCloudUploadAlt size="30px" />
                  <span className="fw-medium">
                    {selectedImage?.length > 0
                      ? "Change Images"
                      : "Upload Images"}
                  </span>
                </div>
                <Controller
                  name="image"
                  control={control}
                  rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <div>
                      <Form.Control
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        isInvalid={!!errors}
                        multiple
                        onChange={(e) => {
                          handleImage(e);
                          field.onChange(e);
                        }}
                        className="position-absolute opacity-0"
                        style={{ top: "25%", right: "0", height: "60px" }}
                      />
                      {selectedImage &&
                        selectedImage.map((img, i) => (
                          <Image
                            src={img}
                            key={i}
                            alt="image preview"
                            style={{ width: "60px", height: "60px" }}
                            className="mt-3 me-2"
                          />
                        ))}
                      <Form.Control.Feedback
                        type="invalid"
                        className="text-start"
                      >
                        {errors.image && errors.image.message}
                      </Form.Control.Feedback>
                    </div>
                  )}
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
              <div className="mt-3 d-flex gap-2">
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <div className="d-flex gap-3">
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
                        {field.value
                          ? "PRODUCT IS ACTIVE"
                          : "PRODUCT NOT ACTIVE"}
                      </span>
                    </div>
                  )}
                />
              </div>
              <span className="small fw-medium">
                This enables your product to be seen by buyers
              </span>
            </CardBox>
            <CardBox>
              <Texts text="CATEGORY" size="12px" className="fw-bold" />
              {error && (
                <Alert variant="danger" className="m-5">
                  {error?.response?.data?.error}
                </Alert>
              )}
              {loading && (
                <div className="d-flex justify-content-center mb-2">
                  <Spinner animation="grow" size="sm" />
                </div>
              )}
              <Form.Group controlId={"category"}>
                <Form.Select
                  aria-label="Default select category"
                  {...register("category", validateFields.category)}
                  isInvalid={!!errors.category}
                  defaultValue={""}
                  style={{ height: "55px" }}
                >
                  <option value="">Select category</option>
                  {categories?.map((item) => (
                    <option value={item.name} key={item._id}>
                      {item.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid" className="text-start">
                  {errors.category?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </CardBox>
          </Col>
        </Row>
      </Form>
    </Page>
  );
}
