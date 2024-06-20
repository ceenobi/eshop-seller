import { useState } from "react";
import {
  AuthFormInput,
  Headings,
  ActionButton,
  Texts,
  ModalView,
  Page,
} from "@/components";
import { useAuth, useTitle } from "@/hooks";
import { useForm } from "react-hook-form";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa";
import { tryCatchFn } from "@/utils";
import { userService } from "@/api";
import { validateFields } from "@/utils";
import { toast } from "react-toastify";
import { Form, Row, Col, Image } from "react-bootstrap";
import { RiErrorWarningLine } from "react-icons/ri";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function Account() {
  const [showPassword, setShowPassword] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { token, loggedInUser, getUser, logout } = useAuth();
  useTitle(`Your account ${loggedInUser?.username}`);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: loggedInUser?.username,
      email: loggedInUser?.email,
      currentPassword: "",
      password: "",
      photo: loggedInUser?.photo,
    },
  });

  const passwordValue = watch("password");
  const currentPasswordValue = watch("currentPassword");

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleHide = () => {
    setReveal((prevReveal) => !prevReveal);
  };

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
      };
    }
  };

  const deleteUserAccount = tryCatchFn(async () => {
    setIsDeleting(true);
    const res = await userService.deleteAccount(token);
    if (res.status === 200) {
      logout();
      toast.success(res.data.msg);
    }
    setIsDeleting(false);
  });

  const onFormSubmit = tryCatchFn(async (credentials) => {
    const formData = {
      photo: selectedImage,
      username: credentials.username,
      email: credentials.email,
      currentPassword: credentials.currentPassword,
      password: credentials.password,
    };
    const updateResponse = await userService.updateAccount(formData, token);
    if (updateResponse.status === 200) {
      toast.success(updateResponse.data.msg);
      getUser(); // Refresh user data
    }
  });

  return (
    <>
      <Page>
        <Headings text="Settings" size="1.5rem" />
        <Form className="mt-4 mx-auto" onSubmit={handleSubmit(onFormSubmit)}>
          <Row>
            <Col md={6} lg={7} xl={8}>
              <div className="mt-4 bg-light-subtle shadow-sm rounded-3 p-3">
                <Texts text="DETAILS" size="12px" className="fw-bold" />
                <div className="d-xl-flex gap-2">
                  <AuthFormInput
                    type="text"
                    id="username"
                    name="username"
                    label="Username (required)"
                    register={register}
                    validateFields={validateFields?.username}
                    placeholder="johndoe"
                    errors={errors.username}
                    className="mb-3 w-100"
                  />
                  <AuthFormInput
                    type="email"
                    id="email"
                    name="email"
                    label="Email address (required)"
                    register={register}
                    validateFields={validateFields?.email}
                    errors={errors.email}
                    placeholder="john@email.com"
                    className="mb-3 w-100"
                  />
                </div>
              </div>
              <div className="mt-4 bg-light-subtle shadow-sm rounded-3 p-3">
                <Texts text="UPDATE PASSWORD" size="12px" className="fw-bold" />
                <div className="position-relative">
                  <AuthFormInput
                    type={reveal ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    label="Current password (required)"
                    register={register}
                    errors={errors.currentPassword}
                    validateFields={
                      currentPasswordValue && validateFields?.currentPassword
                    }
                    placeholder="**********"
                    className="mb-3"
                  />
                  <Texts
                    className="position-absolute top-50 end-0 translate-middle cursor"
                    role="button"
                    onClick={handleHide}
                    text={reveal ? <FaRegEyeSlash /> : <FaRegEye />}
                  />
                </div>
                <div>
                  <AuthFormInput
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    label="New Password (required)"
                    register={register}
                    validateFields={passwordValue && validateFields?.password}
                    errors={errors.password}
                    placeholder="**********"
                    className="mb-3"
                  />
                  <Texts
                    className="text-end fw-bold text-info cursor"
                    text={showPassword ? "HIDE PASSWORD" : "SHOW PASSWORD"}
                    size="12px"
                    onClick={togglePassword}
                  />
                </div>
              </div>
              <div className="mt-4 bg-light-subtle shadow-sm rounded-3 p-3">
                <Texts text="CHANGE PHOTO" size="12px" className="fw-bold" />
                <div className="position-relative rounded-1 bg-secondary-subtle px-4 py-5">
                  <div className="d-flex align-items-center justify-content-center gap-2 bg-white p-3 shadow-sm w-50 mx-auto">
                    <FaCloudUploadAlt size="30px" />
                    <span className="fw-medium">
                      {selectedImage ? "Change Image" : "Upload Image"}
                    </span>
                  </div>
                  <Form.Control
                    type="file"
                    id="photo"
                    name="photo"
                    label="Photo"
                    {...register("photo")}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mb-3 h-100 w-100 position-absolute bottom-0 end-0 opacity-0"
                  />
                  {selectedImage && (
                    <>
                      <Image
                        src={selectedImage}
                        alt="image preview"
                        style={{ width: "60px", height: "60px" }}
                        className="mt-3 me-2"
                      />
                    </>
                  )}
                </div>
              </div>
            </Col>
            <Col md={5} lg={5} xl={4}>
              <div className="mt-4 bg-light-subtle shadow-sm rounded-3 p-3">
                <ActionButton
                  text="Save changes"
                  pending={isSubmitting}
                  className="w-100 mt-3"
                  style={{ backgroundColor: "var(--bg-teal-600)" }}
                  disabled={isSubmitting}
                  type="submit"
                />
              </div>
              <div className="mt-4 bg-light-subtle shadow-sm rounded-3 p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Texts
                    className="fw-bold"
                    text="DELETE ACCOUNT"
                    size="12px"
                  />
                  <Texts
                    className="bg-danger text-white p-2 fw-bold cursor"
                    size="12px"
                    onClick={() => setModalShow(true)}
                    text="DELETE ACCOUNT"
                  />
                </div>
                <div className="d-flex gap-2 border border-warning bg-warning-subtle rounded-3 p-3">
                  <RiErrorWarningLine className="text-danger" size="30px" />
                  <Texts
                    text=" Deleting your account is permanent and cannot be reversed."
                    size="14px"
                    className="fw-medium"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Form>
      </Page>
      <ModalView
        show={modalShow}
        handleClose={() => setModalShow(false)}
        title="Delete account"
        backdrop="static"
      >
        <Texts
          text="You are about to permanently delete your account."
          className="fw-bold"
        />
        <Texts text="Deleting your account is permanent and cannot be reversed. Are you sure?" />
        <div className="d-flex justify-content-end align-items-center gap-3">
          <Texts
            text="Cancel"
            className="fw-bold cursor mt-3"
            role="button"
            onClick={() => setModalShow(false)}
          />
          <ActionButton
            text="DELETE ACCOUNT"
            pending={isDeleting}
            size="sm"
            style={{
              fontSize: "14px",
              width: "170px",
              backgroundColor: "var(--bg-sky-950)",
            }}
            onClick={deleteUserAccount}
          />
        </div>
      </ModalView>
    </>
  );
}
