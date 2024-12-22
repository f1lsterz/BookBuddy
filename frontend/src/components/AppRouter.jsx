import ErrorPage from "../pages/ErrorPage.jsx";
import { publicRoutes } from "../../routes.jsx";
import { Routes, Route } from "react-router-dom";

const AppRouter = () => {
  return (
    <Routes>
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={Component} exact />
      ))}

      <Route path="*" element={<ErrorPage message="Page not found" />} />
    </Routes>
  );
};

export default AppRouter;
