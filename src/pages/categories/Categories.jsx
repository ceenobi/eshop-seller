import { CardBox, Headings, Page, Texts } from "@/components";
import { Alert, Badge, Spinner, Table } from "react-bootstrap";
import { BiPlus } from "react-icons/bi";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth, useFetch, useTitle } from "@/hooks";
import styles from "../pages.module.css";
import { categoryService } from "@/api";
import { useMemo } from "react";

export default function Categories() {
  useTitle("Categories");
  const { merchant } = useAuth();
  const { error, data, loading } = useFetch(
    categoryService.getAllCategories,
    merchant?.merchantCode
  );
  const categories = useMemo(() => data, [data]);
  const location = useLocation();
  const navigate = useNavigate();

  const DisplayCat = () => {
    return (
      <>
        <Page>
          <div className="d-flex justify-content-between align-items-center">
            <Headings text="Categories" size="1.5rem" />
            <Badge pill bg="dark" text="light" className="p-2">
              <Link to="/categories/add">
                <BiPlus />
                ADD
              </Link>
            </Badge>
          </div>
          <Table hover striped bordered responsive className="mt-5">
            <thead>
              <tr className="small">
                <th>NAME</th>
                <th>DESCRIPTION</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(({ name, description, _id }) => (
                <tr
                  key={_id}
                  className="small align-items-center cursor fw-medium"
                  onClick={() => navigate(`/categories/${_id}`)}
                >
                  <td>{name}</td>
                  <td>{description}</td>
                  <td>
                    <Badge
                      bg="danger"
                      text="light"
                      onClick={() => navigate(`/categories/${_id}`)}
                    >
                      VIEW
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Page>
      </>
    );
  };

  const NoCategory = () => {
    return (
      <div className={`${styles.categoryBg}`}>
        <Page>
          <div className="d-flex justify-content-between align-items-center">
            <Headings text="Categories" size="1.5rem" />
            <Badge pill bg="dark" text="light" className="p-2">
              <Link to="/categories/add">
                <BiPlus />
                ADD
              </Link>
            </Badge>
          </div>
          <div className="mt-5 d-flex justify-content-center align-items-center">
            <CardBox style={{ maxWidth: "450px" }}>
              <Texts
                text="Add categories for your products."
                size="16px"
                className="fw-bold"
              />
              <Texts
                text="Adding a category helps to streamline customers experience."
                size="14px"
                className="fw-medium"
              />
              <div className="d-flex justify-content-end">
                <Badge pill bg="dark" text="light" className="p-2">
                  <Link to="/categories/add">
                    <BiPlus />
                    ADD
                  </Link>
                </Badge>
              </div>
            </CardBox>
          </div>
        </Page>
      </div>
    );
  };

  return (
    <>
      {location.pathname === "/categories" ? (
        <>
          {error ? (
            <Alert variant="danger" className="m-5">
              {error?.response?.data?.error || error.message}
            </Alert>
          ) : (
            <>
              {loading ? (
                <div className="d-flex mt-5 justify-content-center">
                  <Spinner animation="grow" size="sm" />
                </div>
              ) : (
                <>{categories?.length > 0 ? <DisplayCat /> : <NoCategory />}</>
              )}
            </>
          )}
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
}
