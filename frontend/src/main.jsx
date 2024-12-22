import { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import User from "./stores/user.js";

export const Context = createContext(null);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Context.Provider
    value={{
      user: new User(),
    }}
  >
    <App />
  </Context.Provider>
);
