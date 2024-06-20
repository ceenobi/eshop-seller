import { categoryService, productService } from "@/api";
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
import { Form, Row, Col, Badge, Alert, Image, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { RiErrorWarningLine } from "react-icons/ri";
import { FaToggleOn, FaToggleOff, FaCloudUploadAlt } from "react-icons/fa";
import { tryCatchFn, validateFields } from "@/utils";
import SimpleMDE from "react-simplemde-editor";

export default function EditProduct() {
  const [selectedImage, setSelectedImage] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { slug } = useParams();
  const { merchant, token } = useAuth();
  const navigate = useNavigate();
  const { error, data, setData, loading } = useFetch(
    productService.getAProduct,
    merchant.merchantCode,
    slug
  );
  const { data: categories } = useFetch(
    categoryService.getAllCategories,
    merchant.merchantCode
  );
  const productDetail = useMemo(() => data, [data]);
  const categoryDetail = useMemo(() => categories, [categories]);
  useTitle(productDetail?.name);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (productDetail) {
      setValue("name", productDetail.name);
      setValue("slug", productDetail.slug);
      setValue("description", productDetail.description);
      setValue("brand", productDetail.brand);
      setValue("price", productDetail.price);
      setValue("category", productDetail.category);
      setValue("isActive", productDetail.isActive);
      setValue("inStock", productDetail.inStock);
      setValue("image", productDetail.image);
      setValue("condition", productDetail.condition);
    }
  }, [productDetail, setValue]);

  const productNameValue = watch("name");

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

  const deleteAProduct = tryCatchFn(async () => {
    setIsDeleting(true);
    const { status, data } = await productService.deleteProduct(
      merchant.merchantCode,
      productDetail?._id,
      token
    );
    if (status === 200) {
      toast.success(data.msg);
      setModalShow(false);
      window.location.replace("/products");
    }
    setIsDeleting(false);
  });

  const onFormSubmit = tryCatchFn(async (credentials) => {
    const { status, data } = await productService.updateProduct(
      merchant.merchantCode,
      productDetail?._id,
      credentials,
      token
    );
    if (status === 200) {
      toast.success(data.msg);
      setData(data.updatedProduct);
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
        onClick={() => navigate("/products")}
      />
      <Headings text="Edit Product" size="1.5rem" />
      {error && <Alert variant="danger">{error?.response?.data?.error}</Alert>}
      {loading && (
        <div className="d-flex justify-content-center mb-2">
          <Spinner animation="grow" size="sm" />
        </div>
      )}
      <Form className="mt-4 mx-auto" onSubmit={handleSubmit(onFormSubmit)}>
        <Row>
          <Col lg={7} xl={8}>
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
                    REGENERATE
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
                  render={({ field }) => (
                    <>
                      <SimpleMDE placeholder="Description" {...field} />
                      <Form.Control.Feedback
                        type="invalid"
                        className="text-start"
                      >
                        {errors.description ? "Description is required" : ""}
                      </Form.Control.Feedback>
                    </>
                  )}
                />
              </div>
            </CardBox>
            <CardBox>
              <Texts text="PRICE" size="12px" className="fw-bold" />
              <div className="d-xl-flex gap-2 align-items-center">
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
                      : "Upload New Images"}
                  </span>
                </div>
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Form.Control
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          handleImage(e);
                          field.onChange(e);
                        }}
                        className="position-absolute opacity-0"
                        style={{ top: "25%", right: "0", height: "60px" }}
                      />
                      {selectedImage.length > 0
                        ? selectedImage.map((img, i) => (
                            <Image
                              src={img}
                              key={i}
                              alt="image preview"
                              style={{ width: "60px", height: "60px" }}
                              className="mt-3 me-2"
                            />
                          ))
                        : productDetail?.image?.map((img, i) => (
                            <Image
                              src={img}
                              key={i}
                              alt={productDetail?.name}
                              style={{ width: "60px", height: "60px" }}
                              className="mt-3 me-2"
                            />
                          ))}
                    </div>
                  )}
                />
              </div>
            </CardBox>
          </Col>
          <Col lg={5} xl={4}>
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
            </CardBox>
            <CardBox>
              <div className="mb-3">
                <Texts text="CATEGORY" size="12px" className="fw-bold" />
                {error && (
                  <Alert variant="danger" className="m-5">
                    {error?.response?.data?.error}
                  </Alert>
                )}
                <Form.Group controlId={"category"}>
                  <Form.Select
                    aria-label="Default select category"
                    {...register("category", validateFields.category)}
                    isInvalid={!!errors.category}
                    defaultValue={productDetail?.category}
                    style={{ height: "55px" }}
                  >
                    <option value="">Select category</option>
                    {categoryDetail?.map((item) => (
                      <option value={item.name} key={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid" className="text-start">
                    {errors.category?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div>
                <Texts text="CONDITION" size="12px" className="fw-bold" />
                <Form.Group controlId={"condition"}>
                  <Form.Select
                    aria-label="Default select condition"
                    {...register("condition")}
                    defaultValue={productDetail?.condition}
                    style={{ height: "55px" }}
                  >
                    <option value="">Select condition</option>
                    <option value="new">New</option>
                    <option value="featured">Featured</option>
                    <option value="best seller">Best Seller</option>
                    <option value="normal">Normal</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </CardBox>
            <CardBox>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Texts className="fw-bold" text="DELETE PRODUCT" size="12px" />
                <Texts
                  className="bg-danger text-white p-2 fw-bold cursor"
                  size="12px"
                  role="button"
                  onClick={() => setModalShow(true)}
                  text="DELETE PRODUCT"
                />
              </div>
              <div className="d-flex gap-2 border border-warning bg-warning-subtle rounded-3 p-2">
                <RiErrorWarningLine className="text-danger" size="30px" />
                <Texts
                  text="Deleting this product will remove it from your product page."
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
        title="Delete product"
        backdrop="static"
      >
        <Texts
          text="You are about to permanently delete this product."
          className="fw-bold"
        />
        <Texts text="Deleting this product is permanent and cannot be reversed. Are you sure?" />
        <div className="d-flex justify-content-end align-items-center gap-3">
          <Texts
            text="Cancel"
            className="fw-bold cursor mt-3"
            role="button"
            onClick={() => setModalShow(false)}
          />
          <ActionButton
            text="DELETE PRODUCT"
            pending={isDeleting}
            size="sm"
            style={{
              fontSize: "14px",
              width: "170px",
              backgroundColor: "var(--bg-sky-950)",
            }}
            onClick={deleteAProduct}
          />
        </div>
      </ModalView>
    </Page>
  );
}
