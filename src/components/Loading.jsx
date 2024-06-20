import { Spinner } from "react-bootstrap";

export default function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Spinner animation="border" role="status" variant="dark">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}
