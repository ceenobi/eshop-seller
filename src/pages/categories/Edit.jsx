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
import { Form, Row, Col, Alert, Image, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { tryCatchFn, validateFields } from "@/utils";
import { FaImage } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useEffect, useMemo, useState } from "react";
import { categoryService } from "@/api";
import { RiErrorWarningLine } from "react-icons/ri";

export default function Edit() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { merchant, token } = useAuth();
  const { categoryId } = useParams();
  const { error, data, loading } = useFetch(
    categoryService.getACategory,
    merchant?.merchantCode,
    categoryId
  );
  const navigate = useNavigate();
  const categoryDetails = useMemo(() => data, [data]);
  useTitle(`Edit category ${categoryDetails?.name}`);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (categoryDetails) {
      setValue("name", categoryDetails?.name);
      setValue("description", categoryDetails?.description);
      setValue("image", categoryDetails?.image);
    }
  }, [categoryDetails, setValue]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file.size > 2 * 1000 * 1000) {
      toast.error("File with maximum size of 2MB is allowed");
      return false;
    }
    transformImage(file);
  };

  const transformImage = (file) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setValue("image", reader.result);
      };
    }
  };

  const deleteACategory = tryCatchFn(async () => {
    setIsDeleting(true);
    const { status, data } = await categoryService.deleteCategory(
      merchant?.merchantCode,
      categoryId,
      token
    );
    if (status === 200) {
      toast.success(data.msg);
      setModalShow(false);
      window.location.replace("/categories");
    }
    setIsDeleting(false);
  });

  const onFormSubmit = tryCatchFn(async (credentials) => {
    const { status, data } = await categoryService.updateACategory(
      merchant?.merchantCode,
      categoryId,
      credentials,
      token
    );
    if (status === 200) {
      toast.success(data.msg);
      window.location.replace("/categories");
    }
  });

  return (
    <Page>
      <Texts
        text={
          <>
            <IoMdArrowBack />
            Categories
          </>
        }
        size="16px"
        className="fw-bold mb-5 cursor"
        onClick={() => navigate("/categories")}
      />
      <Headings text="Edit Category" size="1.5rem" />
      {error && <Alert variant="danger">{error?.response?.data?.error}</Alert>}
      {loading && (
        <div className="d-flex justify-content-center mb-2">
          <Spinner animation="grow" size="sm" />
        </div>
      )}
      <Form className="mt-4 mx-auto" onSubmit={handleSubmit(onFormSubmit)}>
        <Row>
          <Col md={6} lg={7} xl={8}>
            <CardBox>
              <Texts text="DETAILS" size="12px" className="fw-bold" />
              <AuthFormInput
                type="text"
                id="name"
                name="name"
                label="Name"
                register={register}
                validateFields={validateFields?.name}
                errors={errors.name}
                placeholder={categoryDetails?.name}
                className="mb-3 w-100"
              />
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  {...register("description", { required: true })}
                />
                {errors?.description?.type === "required" ? (
                  <span className="text-danger small">
                    This field is required!
                  </span>
                ) : null}
              </Form.Group>
            </CardBox>
            <CardBox>
              <Texts text="IMAGE" size="12px" className="fw-bold" />
              <div className="rounded-1 bg-secondary-subtle px-4 py-5 position-relative">
                <div className="d-flex align-items-center justify-content-center gap-2 bg-white p-3 shadow-sm w-50 mx-auto">
                  <FaImage />
                  <span>{selectedImage ? "Change Image" : "Upload Image"}</span>
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
                          handleImageChange(e);
                          field.onChange(e);
                        }}
                        className="position-absolute opacity-0"
                        style={{ top: "25%", right: "0", height: "60px" }}
                      />
                      {selectedImage ? (
                        <Image
                          src={selectedImage}
                          alt="image preview"
                          style={{ width: "60px", height: "60px" }}
                          className="mt-3 me-2"
                        />
                      ) : (
                        <Image
                          src={categoryDetails?.image}
                          alt={categoryDetails?.name}
                          style={{ width: "60px", height: "60px" }}
                          className="mt-3 me-2"
                        />
                      )}
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
            </CardBox>
            <CardBox>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Texts className="fw-bold" text="DELETE CATEGORY" size="12px" />
                <Texts
                  className="bg-danger text-white p-2 fw-bold cursor"
                  size="12px"
                  role="button"
                  onClick={() => setModalShow(true)}
                  text="DELETE CATEGORY"
                />
              </div>
              <div className="d-flex gap-2 border border-warning bg-warning-subtle rounded-3 p-2">
                <RiErrorWarningLine className="text-danger" size="30px" />
                <Texts
                  text=" Deleting this category will remove it from all products it is active on."
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
        title="Delete discount"
        backdrop="static"
      >
        <Texts
          text="You are about to permanently delete this category."
          className="fw-bold"
        />
        <Texts text="Deleting this category is permanent and cannot be reversed. Are you sure?" />
        <div className="d-flex justify-content-end align-items-center gap-3">
          <Texts
            text="Cancel"
            className="fw-bold cursor mt-3"
            role="button"
            onClick={() => setModalShow(false)}
          />
          <ActionButton
            text="DELETE CATEGORY"
            pending={isDeleting}
            size="sm"
            style={{
              fontSize: "14px",
              width: "170px",
              backgroundColor: "var(--bg-sky-950)",
            }}
            onClick={deleteACategory}
          />
        </div>
      </ModalView>
    </Page>
  );
}
