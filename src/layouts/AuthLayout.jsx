import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { RiShoppingBag2Fill } from "react-icons/ri";
import { formattedDate } from "@/utils";
import { ActionButton } from "@/components";
import Badge from "react-bootstrap/Badge";
import styles from "./layout.module.css";

export default function AuthLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="d-lg-flex">
      <div
        className={`${styles.authBg} min-vh-100 d-flex flex-column justify-items-center justify-content-center text-center px-4`}
      >
        <RiShoppingBag2Fill
          size="3rem"
          className="fw-bold iconBg mb-4 mx-auto"
        />
        {location.pathname === "/authorize" && (
          <ActionButton
            className="w-50 mt-4 mx-auto btns"
            text="Get Started"
            onClick={() => navigate("/authorize/login")}
          />
        )}
        <Outlet />
      </div>
      <div
        className={`${styles.authBgInfo} d-flex flex-column align-items-center justify-content-center p-4 `}
      >
        <div className="mx-auto">
          <div className="d-flex align-items-center justify-content-center">
            <hr className="w-50 text-black" />
            {formattedDate}
            <hr className="w-50 text-black" />
          </div>
          <div className="bg-white p-4 shadow-md rounded-3 mb-4">
            <Badge text="dark" bg="warning">
              New
            </Badge>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
          </div>
          <div className="bg-white p-4 shadow-md rounded-3">
            <Badge bg="success">Update</Badge>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
