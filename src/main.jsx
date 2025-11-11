import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import store from "./store";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "i18n/config";

import "simplebar-react/dist/simplebar.min.css";

import "styles/index.css";
import {Provider} from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
  </React.StrictMode>,
);
