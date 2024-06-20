import { useState } from "react";
import { Image, Dropdown, Button } from "react-bootstrap";
import { pageLinks, settingsLink } from "@/utils";
import { RiShoppingBag2Fill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import { IoMdAddCircle } from "react-icons/io";
import { useAuth } from "@/hooks";
import { Texts } from "@/components";
import classnames from "classnames";
import styles from "./components.module.css";

export default function Sidebar() {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const location = useLocation();
  const { loggedInUser, merchant, logout } = useAuth();

  return (
    <div className="d-none d-lg-block shadow-sm p-4 sidebar">
      <div className={`${styles.innerSidebar} py-3`}>
        <div>
          <RiShoppingBag2Fill
            size="3rem"
            className="fw-bold iconBg my-2 mx-auto"
          />
          <div
            className={`${styles.sidebarItems} d-flex justify-content-between align-items-center p-2 w-100 rounded-3 border-0`}
          >
            {merchant && (
              <div className="d-flex gap-2 align-items-center">
                <Image
                  src="https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png"
                  roundedCircle
                  style={{ width: "30px", height: "30px" }}
                />
                <div>
                  <Texts
                    text={merchant.merchantName}
                    className="fw-bold text-white mb-0 text-uppercase"
                    size="14px"
                  />
                  <span className="small text-white">
                    {merchant.merchantCode}
                  </span>
                </div>
              </div>
            )}
            {!merchant && (
              <Link
                to="/merchant-new"
                className="d-flex gap-2 align-items-center py-2"
              >
                <IoMdAddCircle
                  size="20px"
                  className={`${styles.icon} cursor text-white`}
                />
                <span className="fs-6 fw-bold text-white">Create merchant</span>
              </Link>
            )}
          </div>
          <div
            className="mt-3 text-center overflow-auto"
            style={{ height: "450px" }}
          >
            {pageLinks.map(({ id, Icon, name, path }) => (
              <Button
                as={Link}
                to={`${path}`}
                key={id}
                className={classnames({
                  "rounded-3 active p-3 border-0": location.pathname === path,
                  "links p-3 rounded-3": location.pathname !== path,
                  "d-flex align-items-center gap-2 mb-2 w-100 text-uppercase fw-bold": true,
                })}
                variant="none"
                size="sm"
              >
                <Icon size="1.5rem" color="#3f3f46" />
                <span>{name}</span>
              </Button>
            ))}
            <div>
              <div
                className={classnames({
                  "d-flex align-items-center justify-content-between gap-4 w-100 cursor px-3": true,
                  "links p-3 rounded-3": true,
                })}
                onClick={() => setShowSettingsMenu((prev) => !prev)}
              >
                <div className="d-flex gap-2 align-items-center">
                  <IoIosSettings size="1.5rem" color="#3f3f46" />
                  <span className="text-uppercase fw-bold small">Settings</span>
                </div>
                {!showSettingsMenu ? (
                  <IoIosArrowForward
                    size="20px"
                    className={`${styles.icon} cursor`}
                  />
                ) : (
                  <IoIosArrowBack
                    size="20px"
                    className={`${styles.icon} cursor`}
                  />
                )}
              </div>
              {showSettingsMenu && (
                <div>
                  {settingsLink.map(({ id, label, path }) => (
                    <div className="mt-2 text-start mx-4 w-100" key={id}>
                      <Link
                        to={`${path}`}
                        className={classnames({
                          "text-uppercase fw-medium small mb-0 w-100": true,
                          "links p-2 rounded-3 w-100":
                            location.pathname !== path,
                          "p-2 rounded-3 text-black fw-bold": location.pathname === path,
                        })}
                      >
                        {label}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <hr />
          </div>
        </div>
        <Dropdown drop="end">
          <Dropdown.Toggle
            variant="none"
            id="dropdown-basic"
            className="w-100 text-start"
          >
            <Image
              src={
                loggedInUser?.photo
                  ? loggedInUser?.photo
                  : "https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png"
              }
              roundedCircle
              className="object-fit-cover"
              style={{ width: "30px", height: "30px" }}
              alt={loggedInUser?.username}
            />
            <span className="fw-bold mx-2"> {loggedInUser?.username}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to="/account" className="fw-medium">
              Account
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.ItemText onClick={logout} className="cursor fw-medium">
              Logout
            </Dropdown.ItemText>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}
