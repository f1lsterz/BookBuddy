import {
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  LIBRARY_ROUTE,
  HOME_ROUTE,
  BOOKS_ROUTE,
  PROFILE_ROUTE,
  CLUBS_ROUTE,
} from "./src/utils/consts";
import Registration from "./src/pages/Registration";
import Login from "./src/pages/Login";
import Profile from "./src/pages/Profile";
import Library from "./src/pages/Library";
import Club from "./src/pages/Club";
import Main from "./src/pages/Main";
import Books from "./src/pages/Books";
import Book from "./src/pages/Book";
import Clubs from "./src/pages/Clubs";

export const publicRoutes = [
  {
    path: PROFILE_ROUTE + "/:userId",
    Component: <Profile />,
  },
  {
    path: LIBRARY_ROUTE + "/:userId",
    Component: <Library />,
  },
  {
    path: CLUBS_ROUTE,
    Component: <Clubs />,
  },
  {
    path: CLUBS_ROUTE + "/:clubId",
    Component: <Club />,
  },
  {
    path: LOGIN_ROUTE,
    Component: <Login />,
  },
  {
    path: REGISTRATION_ROUTE,
    Component: <Registration />,
  },
  {
    path: HOME_ROUTE,
    Component: <Main />,
  },
  {
    path: BOOKS_ROUTE,
    Component: <Books />,
  },
  {
    path: BOOKS_ROUTE + "/:bookId",
    Component: <Book />,
  },
];
