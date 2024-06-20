import { ActionButton, AuthFormInput, Texts } from "@/components";
import { useAuth, useTitle } from "@/hooks";
import { useEffect } from "react";
import { Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../pages.module.css";
import { useForm } from "react-hook-form";
import { tryCatchFn, validateFields } from "@/utils";
import { userService } from "@/api";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  useTitle("Forgot your password");
  const navigate = useNavigate();
  const location = useLocation();
  const { token, loggedInUser } = useAuth();
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

  const onFormSubmit = tryCatchFn(async (credentials) => {
    const { status, data } = await userService.forgotPassword(credentials);
    if (status === 200) {
      toast.success(data.msg);
      navigate(from);
    }
  });

  return (
    <>
      <Texts text="Recover your password" className="fw-bold" size="1.25rem" />
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
