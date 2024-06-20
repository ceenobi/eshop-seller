import { Container } from "react-bootstrap";
import { RiShoppingBag2Fill } from "react-icons/ri";
import { TiThMenu } from "react-icons/ti";

export default function Nav() {
  return (
    <Container fluid className="d-flex d-lg-none justify-content-between align-items-center fixed-top w-100 bg-white z-4 py-3 px-3">
      <div className="d-flex gap-2 align-items-center">
        <RiShoppingBag2Fill size="30px" className="fw-bold iconBg" />
        <span className="fw-bold fs-3">TEEM</span>
      </div>
      <TiThMenu size="30px" className="fw-bold iconBg" />
    </Container>
  );
}
