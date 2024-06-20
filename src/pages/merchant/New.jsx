import { useEffect } from "react";
import { merchantImg } from "@/assets";
import { Container, Image, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useTitle, useAuth } from "@/hooks";
import { currency, tryCatchFn } from "@/utils";
import { merchantService } from "@/api";
import { toast } from "react-toastify";
import { validateFields } from "@/utils";
import { ActionButton, AuthFormInput, Headings, Texts } from "@/components";
import styles from "../pages.module.css";

export default function New() {
  useTitle("Create a merchant store");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const { merchant, setMerchant, token, getMerchant } = useAuth();
  const from = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (merchant) {
      navigate(from, { replace: true });
    }
  }, [from, merchant, navigate]);

  const onFormSubmit = tryCatchFn(async (credentials) => {
    const { status, data } = await merchantService.createMerchant(
      credentials,
      token
    );
    if (status === 201) {
      setMerchant(data.merchant);
      getMerchant();
      toast.success(data.msg, {
        icon: "👍",
      });
      navigate("/");
    }
  });

  return (
    <div className={`${styles.merchantBg}`}>
      <Container className=" d-lg-flex justify-content-between">
        <div className="d-none d-lg-block bg-white p-5 min-vh-100">
          <Headings
            text={
              <>
                {" "}
                Let&apos;s set up your <br />
                merchant
              </>
            }
            size="1.875rem"
          />
          <Texts
            text=" Your information can be changed or updated at any time."
            className="fw-medium my-4"
          />
          <div className="mt-4 d-flex justify-content-center">
            <Image
              src={merchantImg}
              alt="Imagemerchant"
              className="w-100 object-fit-cover"
              style={{ height: "400px" }}
            />
          </div>
        </div>
        <div className="d-flex flex-column justify-content-center mx-5 min-vh-100">
          <Form
            className={`${styles.form} mt-2 mx-auto`}
            onSubmit={handleSubmit(onFormSubmit)}
          >
            <Texts
              text="MERCHANT DETAILS"
              size="12px"
              className="fw-bold text-white"
            />
            <AuthFormInput
              type="text"
              id="merchantName"
              name="merchantName"
              label="Merchant Name (required)"
              register={register}
              validateFields={validateFields?.merchantName}
              placeholder="johndoe"
              errors={errors.merchantName}
              className="mb-3"
            />
            <AuthFormInput
              type="email"
              id="merchantEmail"
              name="merchantEmail"
              label="Merchant Email (required)"
              register={register}
              validateFields={validateFields?.merchantEmail}
              errors={errors.merchantEmail}
              placeholder="john@email.com"
              className="mb-3"
            />
            <Form.Group controlId={"currency"}>
              <Form.Select
                aria-label="Default select currency"
                {...register("currency", validateFields.currency)}
                defaultValue={"NGN"}
                isInvalid={!!errors.currency}
                style={{ height: "57px" }}
              >
                {currency?.map((item, i) => (
                  <option
                    value={i === 0 ? "" : item.code}
                    key={item.id}
                    disabled={i === 0}
                  >
                    {item.label}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid" className="text-start">
                {errors.currency?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="mt-4 d-flex gap-4 align-items-center justify-content-end w-100">
              <span
                className="fw-medium text-white cursor"
                onClick={() => navigate("/")}
              >
                Cancel
              </span>
              <ActionButton
                text="Next"
                pending={isSubmitting}
                className="w-50 btns"
                disabled={isSubmitting}
                type="submit"
              />
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
}
