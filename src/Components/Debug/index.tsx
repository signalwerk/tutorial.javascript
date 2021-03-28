import React, { useContext } from "react";
import "./styles.css";
import {
  Context as SessionContext,
  Action as SessionAction,
} from "../../context/session";
import Button from "../Button";
import StatusIcon from "../StatusIcon";
import { useParams } from "react-router-dom";
import { RouterParams } from "../../index";

function StepMenu() {
  const { state, dispatch } = useContext(SessionContext);
  let { chapter, step } = useParams<RouterParams>();

  const print = {
    chapter: chapter,
    step: step,
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
