import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { validateFields } from "@/utils";
import { ActionButton, AuthFormInput, Texts } from "@/components";
import { useAuth, useTitle } from "@/hooks";
import { userService } from "@/api";
import { toast } from "react-toastify";
import { tryCatchFn } from "@/utils";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa";
import styles from "../pages.module.css";

export default function Login() {
  useTitle("Sign in user");
  const [reveal, setReveal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, setToken, loggedInUser, setRefreshToken } = useAuth();
  const from = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (loggedInUser && token) {
      navigate(from, { replace: true });
    }
  }, [from, loggedInUser, navigate, token]);

  const handleHide = () => {
    setReveal((prevReveal) => !prevReveal);
  };

  const onFormSubmit = tryCatchFn(async (credentials) => {
    const { status, data } = await userService.login(credentials);
    if (status === 200) {
      setToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      toast.success(data.msg);
      navigate(from);
    }
  });

  return (
    <>
      <Texts
        text="Login to Teem Dashboard"
        className="fw-bold"
        size="1.25rem"
      />
      <Form
        className={`${styles.form} mt-4 mx-auto`}
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <AuthFormInput
          type="email"
          id="email"
          name="email"
          label="Email address (required)"
          register={register}
          validateFields={validateFields?.email}
          errors={errors.email}
          placeholder="john@email.com"
          className="mb-3"
        />
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
        <ActionButton
          text="Login"
          pending={isSubmitting}
          className="w-100 mt-3 btns"
          disabled={isSubmitting}
          type="submit"
        />
        <div className="mt-3 d-flex justify-content-between align-items-center">
          <p>
            New here?{" "}
            <span className="fw-bold">
              <Link to="/authorize/register">Sign up</Link>
            </span>
          </p>
          <p className="fw-bold">
            <Link to="/authorize/forgot-password">Forgot your password?</Link>
          </p>
        </div>
      </Form>
    </>
  );
}
