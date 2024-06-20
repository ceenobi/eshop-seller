import { useMemo } from "react";
import { taxService } from "@/api";
import {
  AuthFormInput,
  Headings,
  ActionButton,
  Texts,
  Page,
  CardBox,
} from "@/components";
import { useAuth, useFetch, useTitle } from "@/hooks";
import { country, state, tryCatchFn, validateFields } from "@/utils";
import { Alert, Col, Form, Row, Spinner, Table } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

export default function Tax() {
  useTitle("Tax");
  const { merchant, token } = useAuth();
  const { data, error, loading, setData } = useFetch(
    taxService.getAllTax,
    merchant?.merchantCode
  );
  const taxDetails = useMemo(() => data, [data]);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const onCreateTaxFormSubmit = tryCatchFn(async (credentials) => {
    const taxResponse = await taxService.createTax(
      merchant.merchantCode,
      credentials,
      token
    );
    if (taxResponse.status === 201) {
      toast.success(taxResponse.data.msg);
      setData([...taxDetails, taxResponse.data.tax]);
      reset();
    }
  });

  return (
    <>
      {location.pathname === "/tax" ? (
        <Page>
          <Headings text="Tax" size="1.5rem" />
          <Form
            className="mt-4 mx-auto"
            onSubmit={handleSubmit(onCreateTaxFormSubmit)}
          >
            <Row>
              <Col md={7} lg={7} xl={8}>
                <CardBox>
                  <Texts text="ADDRESS" size="12px" className="fw-bold" />
                  <Alert variant="info">
                    This is used to calculate tax and is displayed on invoices.
                  </Alert>
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
                        defaultValue={""}
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
                      <Form.Control.Feedback
                        type="invalid"
                        className="text-start"
                      >
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
                        defaultValue={""}
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
                      <Form.Control.Feedback
                        type="invalid"
                        className="text-start"
                      >
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
                <CardBox>
                  <Texts text="TAX RATES" size="12px" className="fw-bold" />
                  <>
                    {error && (
                      <Alert variant="danger">
                        {error?.response?.data?.error}
                      </Alert>
                    )}
                    {loading && (
                      <div className="d-flex justify-content-center mb-2">
                        <Spinner animation="grow" size="sm" />
                      </div>
                    )}
                    {taxDetails.length > 0 ? (
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>COUNTRY</th>
                            <th>STATE</th>
                            <th>STANDARD RATE</th>
                            <th>STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {taxDetails.map(({ _id, address, rate, enabled }) => (
                            <tr
                              key={_id}
                              onClick={() => navigate(`/tax/${_id}`)}
                              className="cursor"
                            >
                              <td>{address?.country}</td>
                              <td>{address?.state}</td>
                              <td>{rate?.standardRate}</td>
                              <td
                                className={
                                  enabled
                                    ? "text-success fw-bold"
                                    : "text-danger fw-bold"
                                }
                              >
                                {enabled ? "ACTIVE" : "INACTIVE"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <Texts
                        text="No Tax detail to show yet"
                        size="14px"
                        className="fw-bold"
                      />
                    )}
                  </>
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
              </Col>
            </Row>
          </Form>
        </Page>
      ) : (
        <Outlet />
      )}
    </>
  );
}
