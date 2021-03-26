import React, { useContext } from "react";
import "./styles.css";
import {
  Context as SessionContext,
  Action as SessionAction,
} from "../../context/session";
import Button from "../Button";
import StatusIcon from "../StatusIcon";

function StepMenu() {
  const { state, dispatch } = useContext(SessionContext);

  const print = {
    chapter: state.current.chapter,
    step: state.current.step,
    editor: state.current.editor.content,
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
