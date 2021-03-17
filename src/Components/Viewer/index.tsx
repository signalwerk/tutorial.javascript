import React, { useContext } from "react";
import "./styles.css";
import { Context as SessionContext } from "../../context/session";

import CapterMenu from "../CapterMenu";
import StepMenu from "../StepMenu";

function Viewer() {
  const { state, dispatch } = useContext(SessionContext);

  return (
    <div className="viewer">
      <div className="viewer__chapter-menu">
        <CapterMenu />
      </div>
      <div className="viewer__content">
        <div className="viewer__step-menu">
          <StepMenu />
          <br />
          current chapter: {state.current.chapter}
          <br />
          current step: {state.current.step}
        </div>
        <div className="viewer__step">
          <div className="viewer__teach"></div>
          <div className="viewer__learn"></div>
        </div>
      </div>
    </div>
  );
}

export default Viewer;
