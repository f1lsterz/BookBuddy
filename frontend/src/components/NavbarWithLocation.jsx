import { useLocation } from "react-router-dom";
import NavBar from "./Navbar";

const NavBarWithLocation = () => {
  const location = useLocation();

  const hideNavBarRoutes = ["/login", "/registration"];
  const shouldHideNavBar = hideNavBarRoutes.includes(location.pathname);

  if (shouldHideNavBar) {
    return null;
  }

  return <NavBar />;
};

export default NavBarWithLocation;
