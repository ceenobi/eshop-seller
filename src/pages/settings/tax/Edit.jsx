import { taxService } from "@/api";
import {
  AuthFormInput,
  Headings,
  ActionButton,
  Texts,
  Page,
  CardBox,
  ModalView,
} from "@/components";
import { useAuth, useFetch, useTitle } from "@/hooks";
import { country, state, tryCatchFn, validateFields } from "@/utils";
import { Alert, Col, Form, Row, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import { RiErrorWarningLine } from "react-icons/ri";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";

export default function Edit() {
  const [modalShow, setModalShow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { taxId } = useParams();
  const { token, merchant } = useAuth();
  const { error, loading, data } = useFetch(
    taxService.getTax,
    merchant?.merchantCode,
    taxId
  );
  const taxDetail = useMemo(() => data, [data]);
  useTitle(`Edit tax ${taxDetail?.address?.state}`);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (taxDetail) {
      setValue("street", taxDetail?.address?.street);
      setValue("city", taxDetail?.address?.city);
      setValue("state", taxDetail?.address?.state);
      setValue("zip", taxDetail?.address?.zip);
      setValue("country", taxDetail?.address?.country);
      setValue("standardRate", taxDetail?.rate?.standardRate);
      setValue("enabled", taxDetail?.enabled);
    }
  }, [taxDetail, setValue]);

  const deleteATax = tryCatchFn(async () => {
    setIsDeleting(true);
    const { status, data } = await taxService.deleteTax(
      merchant.merchantCode,
      taxId,
      token
    );
    if (status === 200) {
      toast.success(data.msg);
      window.location.replace("/tax");
    }
    setIsDeleting(false);
  });

  const onUpdateTaxFormSubmit = tryCatchFn(async (credentials) => {
    const { status, data } = await taxService.updateTax(
      merchant?.merchantCode,
      taxId,
      credentials,
      token
    );
    if (status === 200) {
      toast.success(data.msg);
      window.location.replace("/tax");
    }
  });

  return (
    <Page>
      <Texts
        text={
          <>
            <IoMdArrowBack />
            Tax
          </>
        }
        size="16px"
        className="fw-bold mb-5 cursor"
        onClick={() => navigate("/tax")}
      />
      <Headings text="Edit Tax" size="1.5rem" />
      {error && <Alert variant="danger">{error?.response?.data?.error}</Alert>}
      {loading && (
        <div className="d-flex justify-content-center mb-2">
          <Spinner animation="grow" size="sm" />
        </div>
      )}
      <Form
        className="mt-4 w-100"
        onSubmit={handleSubmit(onUpdateTaxFormSubmit)}
      >
        <Row>
          <Col md={7} lg={7} xl={8}>
            <CardBox>
              <Texts text="ADDRESS" size="12px" className="fw-bold" />
              <AuthFormInput
                type="text"
                id="street"
                name="street"
                label="Street"
                register={register}
                validateFields={validateFields?.street}
                errors={errors.street}
                placeholder="Enter street"
                className="mb-3 w-100"
              />
              <div className="d-xl-flex gap-2">
                <AuthFormInput
                  type="text"
                  id="city"
                  name="city"
                  label="City"
                  register={register}
                  validateFields={validateFields?.city}
                  errors={errors.city}
                  placeholder="City"
                  className="mb-3 w-100"
                />
                <Form.Group controlId={"state"} className="w-100">
                  <Form.Select
                    aria-label="Default select state"
                    {...register("state", validateFields?.state)}
                    defaultValue={taxDetail?.address?.state}
                    isInvalid={!!errors.state}
                    style={{ height: "57px" }}
                  >
                    {state?.map((item, i) => (
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
                    {errors?.state?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="d-xl-flex gap-2">
                <AuthFormInput
                  type="text"
                  id="zip"
                  name="zip"
                  label="Postal/Zip"
                  register={register}
                  validateFields={validateFields?.zip}
                  errors={errors.zip}
                  placeholder="Zip code"
                  className="mb-3 w-100"
                />
                <Form.Group controlId={"country"} className="w-100">
                  <Form.Select
                    aria-label="Default select country"
                    {...register("country", validateFields.country)}
                    isInvalid={!!errors.country}
                    defaultValue={taxDetail?.address?.country}
                    style={{ height: "57px" }}
                  >
                    {country?.map((item, i) => (
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
                    {errors?.country?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <AuthFormInput
                type="number"
                id="standardRate"
                name="standardRate"
                label="Standard Rate"
                register={register}
                validateFields={validateFields?.standardRate}
                errors={errors.standardRate}
                placeholder="Enter rate"
                className="mb-0 w-100"
              />
              <Form.Text id="description" muted className="fw-bold">
                Set a tax rate for your products. This is calculated in
                percentage
              </Form.Text>
              <Form.Control.Feedback type="invalid" className="text-start">
                {errors?.standardRate?.message}
              </Form.Control.Feedback>
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
              <div className="mt-3 d-flex gap-3">
                <Controller
                  name="enabled"
                  control={control}
                  render={({ field }) => (
                    <div className="mt-3 d-flex gap-3">
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
                        {field.value ? "TAX ENABLED" : "TAX DISABLED"}
                      </span>
                    </div>
                  )}
                />
              </div>
            </CardBox>
            <CardBox>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Texts className="fw-bold" text="DELETE TAX" size="12px" />
                <Texts
                  className="bg-danger text-white p-2 fw-bold cursor"
                  size="12px"
                  role="button"
                  onClick={() => setModalShow(true)}
                  text="DELETE TAX"
                />
              </div>
              <div className="d-flex gap-2 border border-warning bg-warning-subtle rounded-3 p-2">
                <RiErrorWarningLine className="text-danger" size="30px" />
                <Texts
                  text=" Deleting your tax rate will remove it from all products it is active on."
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
        title="Delete tax"
        backdrop="static"
      >
        <Texts
          text="You are about to permanently delete this tax rate."
          className="fw-bold"
        />
        <Texts text="Deleting your tax rate is permanent and cannot be reversed. Are you sure?" />
        <div className="d-flex justify-content-end align-items-center gap-3">
          <Texts
            text="Cancel"
            className="fw-bold cursor mt-3"
            role="button"
            onClick={() => setModalShow(false)}
          />
          <ActionButton
            text="DELETE DISCOUNT"
            pending={isDeleting}
            size="sm"
            style={{
              fontSize: "14px",
              width: "170px",
              backgroundColor: "var(--bg-sky-950)",
            }}
            onClick={deleteATax}
          />
        </div>
      </ModalView>
    </Page>
  );
}
