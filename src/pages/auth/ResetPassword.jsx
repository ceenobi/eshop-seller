import { ActionButton, AuthFormInput, Texts } from "@/components";
import { useAuth, useTitle } from "@/hooks";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "../pages.module.css";
import { useForm } from "react-hook-form";
import { tryCatchFn, validateFields } from "@/utils";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { userService } from "@/api";

export default function ResetPassword() {
  useTitle("Reset your password");
  const [reveal, setReveal] = useState(false);
  const [revealB, setRevealB] = useState(false);
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedInUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const from = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (loggedInUser && token) {
      navigate(from, { replace: true });
    }
  }, [from, loggedInUser, navigate, token]);

  const handleHide = () => {
    setReveal((prevReveal) => !prevReveal);
  };
  const handleHideB = () => {
    setRevealB((prevReveal) => !prevReveal);
  };

  const onFormSubmit = tryCatchFn(async (credentials) => {
    if (credentials.password !== credentials.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const { status, data } = await userService.resetPassword(userId, token, {
      password: credentials.password,
    });
    if (status === 200) {
      toast.success(data.msg);
      navigate("/authorize/login");
    }
  });

  return (
    <>
      <Texts text="Recover your password" className="fw-bold" size="1.25rem" />
      <Form
        className={`${styles.form} mt-4 mx-auto`}
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <div className="position-relative">
          <AuthFormInput
            type={reveal ? "text" : "password"}
            id="password"
            name="password"
            label="Password (required)"
            register={register}
            errors={errors.password}
            validateFields={validateFields?.password}
            placeholder="**********"
            className="mb-3"
          />
          <Texts
            className="position-absolute top-50 end-0 translate-middle cursor"
            onClick={handleHide}
            text={reveal ? <FaRegEyeSlash /> : <FaRegEye />}
          />
        </div>
        <div className="position-relative">
          <AuthFormInput
            type={revealB ? "text" : "password"}
            id="password"
            name="confirmPassword"
            label="Confirm Password (required)"
            register={register}
            errors={errors.confirmPassword}
            validateFields={validateFields?.password}
            placeholder="**********"
            className="mb-3"
          />
          <Texts
            className="position-absolute top-50 end-0 translate-middle cursor"
            onClick={handleHideB}
            text={revealB ? <FaRegEyeSlash /> : <FaRegEye />}
          />
        </div>
        <ActionButton
          text="Recover"
          pending={isSubmitting}
          className="w-100 mt-2 btns"
          disabled={isSubmitting}
          type="submit"
        />
      </Form>
    </>
  );
}
