import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./fontello/css/fontello.css";
import Viewer from "./Components/Viewer";
import Debug from "./Components/Debug";
import Admin from "./Components/Admin";
import Version from "./Components/Version";
import reportWebVitals from "./reportWebVitals";

// setup Provider

import { Provider as SessionProvider } from "./context/session";

ReactDOM.render(
  <React.StrictMode>
    <SessionProvider>
      <div className="container">
        <Viewer />
        {process.env.REACT_APP_DEV && (
          <>
            <Debug />
            <Admin />
          </>
        )}
        <Version />
      </div>
    </SessionProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
