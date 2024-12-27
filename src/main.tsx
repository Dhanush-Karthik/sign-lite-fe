import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./core/redux/store";
import App from "./App";

import "./index.css";

import Framework7 from "framework7/lite-bundle";
import Framework7React from "framework7-react";

// Init F7-React Plugin
// eslint-disable-next-line react-hooks/rules-of-hooks
Framework7.use(Framework7React);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
