import React, { useContext } from "react";
import Window from "../Window";
import WorkSpace from "../WorkSpace";
import "./styles.css";
import { Context as SessionContext } from "../../context/session";

import CapterMenu from "../CapterMenu";
import StepMenu from "../StepMenu";
import Player from "../Player";
import Editor from "../Editor";

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
        </div>
        <div className="viewer__step">
          <div className="viewer__teach">
            <Player
              filename="JavaScript"
              text={'Box()\nBox(30, 40)\nprint(1);\nprint("hello");\n'}
            />
          </div>
          <div className="viewer__task">
          <div className="viewer__window">
            <Window filename="Aufgabe">
              <div className="viewer__task-text">
                <p>
                  <span>Rufen Sie die funktion </span>
                  <code>Box()</code>
                  <span> mit der x-Position </span>
                  <code>20</code>
                  <span> und der y-Position </span>
                  <code>50</code>
                  <span> auf.</span>
                </p>
              </div>
            </Window>
          </div>
          </div>
          <div className="viewer__learn">
            <WorkSpace preview={state.current.editor.content}>
              <Window filename="JavaScript">
                <Editor />
              </Window>
            </WorkSpace>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Viewer;
