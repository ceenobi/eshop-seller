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
import { Col, Form, Image, Row } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { tryCatchFn, validateFields } from "@/utils";
import { useState } from "react";
import { useAuth, useTitle } from "@/hooks";
import { categoryService } from "@/api";
import { toast } from "react-toastify";
import { FaImage } from "react-icons/fa6";

export default function Add() {
  useTitle("Add category");
  const [selectedImage, setSelectedImage] = useState(null);
  const { merchant, token } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
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

  const onFormSubmit = tryCatchFn(async (credentials) => {
    const { status, data } = await categoryService.createCategory(
      merchant?.merchantCode,
      credentials,
      token
    );
    if (status === 201) {
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
        onClick={() => navigate(-1)}
      />
      <Headings text="Add Category" size="1.5rem" />
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
                placeholder="Enter category name"
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
                      {selectedImage && (
                        <Image
                          src={selectedImage}
                          alt="image preview"
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
          </Col>
        </Row>
      </Form>
    </Page>
  );
}
