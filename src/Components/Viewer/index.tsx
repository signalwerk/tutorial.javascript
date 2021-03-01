import React, { useContext } from "react";
import "./styles.css";
import { Context as SessionContext } from "../../context/session";

import CapterMenu from "../CapterMenu";

function Viewer() {
  const { state, dispatch } = useContext(SessionContext);

  return (
    <div className="Viewer">
      <CapterMenu />
      <br />
      current: {state.current}
    </div>
  );
}

export default Viewer;
