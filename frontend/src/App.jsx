import { useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import { Context } from "./main";
import AppRouter from "./components/AppRouter";
import NavBarWithLocation from "./components/NavbarWithLocation";
import styles from "./App.module.css";
import { observer } from "mobx-react-lite";

const App = observer(() => {
  const { user } = useContext(Context);

  if (localStorage.getItem("token")) {
    user.setIsAuth(true);
  }

  return (
    <BrowserRouter>
      <div className={styles.App}>
        <div className={styles.NavBarContainer}>
          <NavBarWithLocation />
        </div>
        <div className={styles.MainContent}>
          <AppRouter />
        </div>
      </div>
    </BrowserRouter>
  );
});

export default App;
