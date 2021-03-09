import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./fontello/css/fontello.css";
import App from "./App";
import Viewer from "./Components/Viewer";
import reportWebVitals from "./reportWebVitals";

// setup Provider

import { Provider as SessionProvider } from "./context/session";

ReactDOM.render(
  <React.StrictMode>
    <SessionProvider>
      <div className="container">
        <Viewer />
      </div>
    </SessionProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
