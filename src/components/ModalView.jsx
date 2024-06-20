import { Modal } from "react-bootstrap";
import { IoClose } from "react-icons/io5";

export default function ModalView({
  show,
  handleClose,
  title,
  children,
  size,
  ...props
}) {
  return (
    <Modal show={show} onHide={handleClose} centered size={size} {...props}>
      <div className="d-flex justify-content-between align-items-center p-3">
        <Modal.Title style={{ fontSize: "18px" }} className="fw-bold">
          {title}
        </Modal.Title>
        <IoClose size="20px" onClick={handleClose} className="cursor" />
      </div>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
}
