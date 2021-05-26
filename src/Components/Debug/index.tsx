import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { Context as SessionContext } from "../../context/session";
import { RouterParams } from "../../index";
import "./styles.css";

function StepMenu() {
  const { state } = useContext(SessionContext);
  let { chapter, step } = useParams<RouterParams>();

  const print = {
    chapter: chapter,
    step: step,
    // progress: state.progress?.functions,
    // progress_1: get(state.progress),
    selection: `${state.current.editor.selection.start} – ${state.current.editor.selection.end}`,
  };

  return (
    <div className="debug">
      <h3>Debug</h3>
      <pre className="code">
        <code>{JSON.stringify(print, null, 2)}</code>
      </pre>
    </div>
  );
}

export default StepMenu;
