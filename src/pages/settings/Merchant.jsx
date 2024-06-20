import {
  AuthFormInput,
  Headings,
  ActionButton,
  Texts,
  ModalView,
  Page,
  CardBox,
} from "@/components";
import { useAuth, useTitle } from "@/hooks";
import { useForm, Controller } from "react-hook-form";
import { tryCatchFn, state, country, currency } from "@/utils";
import { merchantService } from "@/api";
import { validateFields } from "@/utils";
import { toast } from "react-toastify";
import { Form, Row, Col, Image } from "react-bootstrap";
import { RiErrorWarningLine } from "react-icons/ri";
import SimpleMDE from "react-simplemde-editor";
import { FaImage } from "react-icons/fa";
import { useState } from "react";

export default function Merchant() {
  const [modalShow, setModalShow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedLogoImage, setSelectedLogoImage] = useState(null);
  const [selectedCoverImage, setSelectedCoverImage] = useState(null);
  const { token, loggedInUser, merchant, getMerchant, setMerchant } = useAuth();
  useTitle(`Your account ${loggedInUser?.username}`);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      merchantName: merchant?.merchantName,
      merchantEmail: merchant?.merchantEmail,
      logo: merchant?.logo,
      description: merchant?.description,
      coverImage: merchant?.coverImage,
      currency: merchant?.currency,
      street: merchant?.address?.street,
      city: merchant?.address?.city,
      state: merchant?.address?.state,
      zip: merchant?.address?.zip,
      country: merchant?.address?.country,
    },
  });

  const merchantNameValue = watch("merchantName");
  const merchantEmailValue = watch("merchantEmail");

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSelectedLogoImage(reader.result);
      };
    }
  };

  const handleCoverImgChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSelectedCoverImage(reader.result);
      };
    }
  };

  const deleteMerchantAccount = tryCatchFn(async () => {
    setIsDeleting(true);
    const res = await merchantService.deleteMerchant(token);
    if (res.status === 200) {
      toast.success(res.data.msg);
      reset();
      setMerchant(null);
      setModalShow(false);
    }
    setIsDeleting(false);
  });

  const onFormSubmit = tryCatchFn(async (credentials) => {
    const formData = {
      logo: selectedLogoImage,
      coverImage: selectedCoverImage,
      merchantName: credentials.merchantName,
      merchantEmail: credentials.merchantEmail,
      description: credentials.description,
      currency: credentials.currency,
      street: credentials.street,
      city: credentials.city,
      zip: credentials.zip,
      state: credentials.state,
      country: credentials.country,
    };
    const updateResponse = await merchantService.updateMerchant(
      merchant?._id,
      formData,
      token
    );
    if (updateResponse.status === 200) {
      toast.success(updateResponse.data.msg);
      setMerchant(updateResponse.data.updatedMerchant);
      getMerchant(); // Refresh merchant data
    }
  });

  return (
    <Page>
      <Headings text="Merchant details" size="1.5rem" />
      <Form className="mt-4 mx-auto" onSubmit={handleSubmit(onFormSubmit)}>
        <Row>
          <Col md={7} lg={7} xl={8}>
            <CardBox>
              <Texts text="DETAILS" size="12px" className="fw-bold" />
              <div className="d-xl-flex gap-2">
                <AuthFormInput
                  type="text"
                  id="merchantName"
                  name="merchantName"
                  label="Merchant Name (required)"
                  register={register}
                  validateFields={
                    merchantNameValue && validateFields?.merchantName
                  }
                  placeholder="johndoe"
                  errors={errors.merchantName}
                  className="mb-3 w-100"
                />
                <AuthFormInput
                  type="email"
                  id="merchantEmail"
                  name="merchantEmail"
                  label="Merchant Email (required)"
                  register={register}
                  validateFields={
                    merchantEmailValue && validateFields?.merchantEmail
                  }
                  errors={errors.merchantEmail}
                  placeholder="john@email.com"
                  className="mb-3 w-100"
                />
              </div>
            </CardBox>
            <CardBox>
              <Texts text="DESCRIPTION" size="12px" className="fw-bold" />
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <SimpleMDE placeholder="Description" {...field} />
                )}
              />
              <Form.Text id="description" muted className="fw-bold">
                A brief description about yourself/your company
              </Form.Text>
            </CardBox>
            <CardBox>
              <Texts text="ADDRESS" size="12px" className="fw-bold" />
              <AuthFormInput
                type="text"
                id="street"
                name="street"
                label="Street"
                register={register}
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
                  placeholder="City"
                  className="mb-3 w-100"
                />
                <Form.Group controlId={"state"} className="w-100">
                  <Form.Select
                    aria-label="Default select state"
                    {...register("state", validateFields.state)}
                    defaultValue={merchant?.address?.state}
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
                </Form.Group>
              </div>
              <div className="d-xl-flex gap-2">
                <AuthFormInput
                  type="text"
                  id="zip"
                  name="zip"
                  label="Postal/Zip"
                  register={register}
                  placeholder="Zip code"
                  className="mb-3 w-100"
                />
                <Form.Group controlId={"country"} className="w-100">
                  <Form.Select
                    aria-label="Default select country"
                    {...register("country")}
                    defaultValue={merchant?.address?.currency}
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
                </Form.Group>
              </div>
            </CardBox>
            <CardBox>
              <Texts text="CURRENCY" size="12px" className="fw-bold" />
              <Form.Group controlId={"currency"}>
                <Form.Select
                  aria-label="Default select currency"
                  {...register("currency")}
                  defaultValue={merchant?.currency}
                  style={{ height: "55px" }}
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
              </Form.Group>
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
            <CardBox>
              <div className="d-flex gap-3 mb-2 border border-secondary rounded-1 bg-secondary-subtle p-2">
                <span className="fw-bold">Merchant Id:</span>
                <Headings
                  text={merchant?.merchantCode}
                  size="1.2rem"
                  className=""
                />
              </div>
              <Texts
                text="This is your unique merchant ID. We may ask for it when you contact us."
                size="14px"
                className="fw-medium"
              />
            </CardBox>
            <CardBox>
              <Texts text="LOGO" size="12px" className="fw-bold" />
              <div className="rounded-1 bg-secondary-subtle p-4 position-relative">
                <div className="d-flex align-items-center justify-content-center gap-2 bg-white p-3 shadow-sm">
                  <FaImage />
                  <span>
                    {" "}
                    {merchant?.logo ? "Change Image" : "Upload Image"}
                  </span>
                </div>
                <Form.Control
                  type="file"
                  id="logo"
                  name="logo"
                  label="Logo"
                  {...register("logo")}
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="h-100 w-100 position-absolute bottom-0 end-0 opacity-0"
                />
                <Image
                  src={merchant?.logo ? merchant?.logo : selectedLogoImage}
                  alt="logo preview"
                  style={{ width: "60px", height: "60px" }}
                  className="mt-3 me-2"
                />
              </div>
            </CardBox>
            <CardBox>
              <Texts text="COVER IMAGE" size="12px" className="fw-bold" />
              <div className="rounded-1 bg-secondary-subtle p-4 position-relative">
                <div className="d-flex align-items-center justify-content-center gap-2 bg-white p-3 shadow-sm">
                  <FaImage />
                  <span>
                    {merchant?.coverImage ? "Change Image" : "Upload Image"}
                  </span>
                </div>
                <Form.Control
                  type="file"
                  id="coverImage"
                  name="coverImage"
                  label="Cover Image"
                  {...register("coverImage")}
                  accept="image/*"
                  onChange={handleCoverImgChange}
                  className="h-100 w-100 position-absolute bottom-0 end-0 opacity-0"
                />
              </div>
              <Texts
                text="Cover image that will be shown on your store front."
                size="14px"
                className="fw-medium"
              />
              <Image
                src={
                  merchant?.coverImage
                    ? merchant?.coverImage
                    : selectedCoverImage
                }
                alt="cover image preview"
                style={{ width: "60px", height: "60px" }}
                className="mt-3 me-2"
              />
            </CardBox>
            <CardBox>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Texts className="fw-bold" text="DELETE MERCHANT" size="12px" />
                <Texts
                  className="bg-danger text-white p-2 fw-bold cursor"
                  size="12px"
                  role="button"
                  onClick={() => setModalShow(true)}
                  text="DELETE MERCHANT"
                />
              </div>
              <div className="d-flex gap-2 border border-warning bg-warning-subtle rounded-3 p-3">
                <RiErrorWarningLine className="text-danger" size="30px" />
                <Texts
                  text=" Deleting your merchant is permanent and cannot be reversed."
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
        title="Delete account"
        backdrop="static"
      >
        <Texts
          text="You are about to permanently delete your merchant."
          className="fw-bold"
        />
        <Texts text="Deleting your merchant is permanent and cannot be reversed. Are you sure?" />
        <div className="d-flex justify-content-end align-items-center gap-3">
          <Texts
            text="Cancel"
            className="fw-bold cursor mt-3"
            role="button"
            onClick={() => setModalShow(false)}
          />
          <ActionButton
            text="DELETE MERCHANT"
            pending={isDeleting}
            size="sm"
            style={{
              fontSize: "14px",
              width: "170px",
              backgroundColor: "var(--bg-sky-950)",
            }}
            onClick={deleteMerchantAccount}
          />
        </div>
      </ModalView>
    </Page>
  );
}
