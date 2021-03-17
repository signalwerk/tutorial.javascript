import React, { useContext } from "react";
import "./styles.css";
import { Context as SessionContext } from "../../context/session";

import CapterMenu from "../CapterMenu";

function Viewer() {
  const { state, dispatch } = useContext(SessionContext);

  return (
    <div className="viewer">
      <div className="viewer__inner">
        <div className="viewer__menu">
          <CapterMenu />
        </div>
        <div className="viewer__content">
          <br />
          current chapter: {state.current.chapter}
          <br />
          current step: {state.current.step}
        </div>
      </div>
    </div>
  );
}

export default Viewer;
