import { useMemo } from "react";
import { shippingService } from "@/api";
import {
  AuthFormInput,
  Headings,
  ActionButton,
  Texts,
  Page,
  CardBox,
} from "@/components";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { Alert, Col, Form, Row, Spinner, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { country, state, tryCatchFn, validateFields } from "@/utils";
import { useAuth, useFetch, useTitle } from "@/hooks";
import { toast } from "react-toastify";

export default function Shipping() {
  useTitle("Your shipping");
  const navigate = useNavigate();
  const location = useLocation();
  const { merchant, token } = useAuth();
  const { data, error, loading, setData } = useFetch(
    shippingService.getAllShipping,
    merchant?.merchantCode
  );
  const shippingDetails = useMemo(() => data, [data]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onCreateShipping = tryCatchFn(async (credentials) => {
    const res = await shippingService.createShipping(
      merchant.merchantCode,
      credentials,
      token
    );
    if (res.status === 201) {
      toast.success(res.data.msg);
      setData([...shippingDetails, res.data.shippingFee]);
      reset();
    }
  });

  return (
    <div>
      {location.pathname === "/shipping" ? (
        <Page>
          <Headings text="Shipping" size="1.5rem" />
          <Form
            className="mt-4 mx-auto"
            onSubmit={handleSubmit(onCreateShipping)}
          >
            <Row>
              <Col md={7} lg={7} xl={8}>
                <CardBox>
                  <Texts
                    text="SET SHIPPING FEE"
                    size="12px"
                    className="fw-bold"
                  />
                  <Form.Group controlId={"state"} className="w-100 mb-3">
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
                  <Form.Group controlId={"country"} className="w-100 mb-3">
                    <Form.Select
                      aria-label="Default select country"
                      {...register("country", validateFields.country)}
                      isInvalid={!!errors.country}
                      defaultValue={"Nigeria"}
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
                  <AuthFormInput
                    type="number"
                    id="amount"
                    name="amount"
                    label="Amount"
                    register={register}
                    validateFields={validateFields?.amount}
                    errors={errors.amount}
                    placeholder="Enter amount"
                    className="mb-3 w-100"
                  />
                </CardBox>
                <CardBox>
                  <Texts text="SUMMARY" size="12px" className="fw-bold" />
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
                  {shippingDetails.length > 0 ? (
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>COUNTRY</th>
                          <th>STATE</th>
                          <th>AMOUNT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shippingDetails.map(
                          ({ _id, state, country, amount }) => (
                            <tr
                              key={_id}
                              onClick={() => navigate(`/shipping/${_id}`)}
                              className="cursor"
                            >
                              <td>{country}</td>
                              <td>{state}</td>
                              <td>{amount}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </Table>
                  ) : (
                    <Texts
                      text="No Shipping fee added yet"
                      size="14px"
                      className="fw-bold"
                    />
                  )}
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
      ) : (
        <Outlet />
      )}
    </div>
  );
}
