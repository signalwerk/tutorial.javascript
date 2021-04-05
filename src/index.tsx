import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./fontello/css/fontello.css";
import Viewer from "./Components/Viewer";
import Debug from "./Components/Debug";
import Admin from "./Components/Admin";
import Version from "./Components/Version";
import Home from "./Components/Home";
import reportWebVitals from "./reportWebVitals";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";

// setup Provider

import { Provider as SessionProvider } from "./context/session";
import { Provider as CourseProvider } from "./context/course";

export interface RouterParams {
  chapter: string;
  step: string;
}

ReactDOM.render(
  <React.StrictMode>
    <CourseProvider>
      <SessionProvider>
        <Router>
          <div className="container">
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/course/js/basic/:chapter/:step">
                <Viewer />
              </Route>
            </Switch>

            {process.env.REACT_APP_DEV && (
              <>
                <Debug />
                <Admin />
              </>
            )}
            <Version />
          </div>
        </Router>
      </SessionProvider>
    </CourseProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
