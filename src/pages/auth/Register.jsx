import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ActionButton, AuthFormInput, Headings, Texts } from "@/components";
import { useAuth, useTitle } from "@/hooks";
import { userService } from "@/api";
import { toast } from "react-toastify";
import { tryCatchFn, validateFields } from "@/utils";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa";
import styles from "../pages.module.css";

export default function Register() {
  useTitle("Sign up user");
  const [reveal, setReveal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, setToken } = useAuth();
  const from = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (token) {
      navigate(from, { replace: true });
    }
  }, [from, token, navigate]);

  const handleHide = () => {
    setReveal((prevReveal) => !prevReveal);
  };

  const onFormSubmit = tryCatchFn(async (credentials) => {
    const { status, data } = await userService.register(credentials);
    if (status === 201) {
      setToken(data.accessToken);
      toast.success(data.msg);
      navigate(from);
    }
  });

  return (
    <>
      <Headings
        text="Create your free account"
        color="var(--bg-teal-600)"
        size="1.875rem"
      />
      <Texts
        text="Start selling in 5 minutes"
        className="fw-bold"
        color="var(--bg-sky-950)"
        size="1.25rem"
      />
      <Form
        className={`${styles.form} mt-4 mx-auto`}
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <AuthFormInput
          type="text"
          id="username"
          name="username"
          label="Username (required)"
          register={register}
          validateFields={validateFields?.username}
          placeholder="johndoe"
          errors={errors.username}
          className="mb-3"
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
          text="Create your account"
          pending={isSubmitting}
          className="w-100 mt-3 btns"
          disabled={isSubmitting}
          type="submit"
        />
        <div className="mt-3">
          <p>
            Already have an account?{" "}
            <span className="fw-bold">
              <Link to="/authorize/login">Login</Link>
            </span>
          </p>
        </div>
      </Form>
    </>
  );
}
