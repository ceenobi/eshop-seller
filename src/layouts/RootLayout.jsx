import { Nav, Sidebar, Texts } from "@/components";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <main>
      <div className="d-flex">
        <Sidebar />
        <Container fluid className="outlet p-0">
          <div style={{ minHeight: "90dvh" }}>
            <Nav />
            <Outlet />
          </div>
          <div className="mx-4 py-2">
            <hr />
            <div className="d-flex align-items-center justify-content-between text-uppercase fw-bold">
              <Texts text={<>&copy;Teem platform, inc</>} size="12px" />
              <Texts text="Documentation" size="12px" />
            </div>
          </div>
        </Container>
      </div>
    </main>
  );
};

export default RootLayout;
