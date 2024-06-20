import { Form, FloatingLabel } from "react-bootstrap";

export const AuthFormInput = ({
  type,
  id,
  name,
  label,
  placeholder,
  register,
  validateFields,
  errors,
  className,
}) => {
  return (
    <FloatingLabel controlId={id} label={label} className={className}>
      <Form.Control
        type={type}
        name={name}
        {...register(name, validateFields)}
        placeholder={placeholder}
        size="lg"
        isInvalid={!!errors}
        disabled={errors && errors[name] ? true : false}
        className="bg-light.bg-gradient"
      />
      <Form.Control.Feedback type="invalid" className="text-start">
        {errors?.message}
      </Form.Control.Feedback>
    </FloatingLabel>
  );
};

export const FormSelect = ({
  id,
  name,
  extra,
  register,
  errors,
  label,
  defaultValue,
  validateFields,
  children,
  ...props
}) => {
  <Form.Group className={extra} controlId={id}>
    <Form.Label>{label}</Form.Label>
    <Form.Select
      aria-label="Default select options"
      name={name}
      {...register(name, validateFields)}
      defaultValue={defaultValue || ""}
      isInvalid={!!errors}
      {...props}
    >
      {children}
    </Form.Select>
    <Form.Control.Feedback type="invalid" className="text-start">
      {errors?.message}
    </Form.Control.Feedback>
  </Form.Group>;
};
