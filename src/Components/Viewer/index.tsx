import React, { useContext } from "react";
import Window from "../Window";
import WorkSpace from "../WorkSpace";
import "./styles.css";
import { Context as SessionContext } from "../../context/session";

import CapterMenu from "../CapterMenu";
import StepMenu from "../StepMenu";
import Player from "../Player";
import Editor from "../Editor";

/**
 * Returns the index of the last element in the array where predicate is true, and -1
 * otherwise.
 * @param array The source array to search in
 * @param predicate find calls predicate once for each element of the array, in descending
 * order, until it finds one where predicate returns true. If such an element is found,
 * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
 */
export function findLastIndex<T>(
  array: Array<T>,
  predicate: (value: T, index: number, obj: T[]) => boolean
): number {
  let l = array.length;
  while (l--) {
    if (predicate(array[l], l, array)) return l;
  }
  return -1;
}

function Viewer() {
  const { state, dispatch } = useContext(SessionContext);

  const chapter = state.chapters.find(
    (item) => item.id === state.current.chapter
  );
  const step = chapter?.steps?.find((item) => item.id === state.current.step);
  const pos = state.current.playPosition;

  // const editorPlayerStepPos =
  //   step?.intro.editor.findIndex((item) => item.time >= pos * 1000) || 0;

  const editorPlayerStepPos = step
    ? findLastIndex(step.intro.editor, (item) => item.time <= pos * 1000)
    : 0;

  console.log({ editorPlayerStepPos });

  const editorPlayerStep = step?.intro.editor[editorPlayerStepPos];

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
            <Player filename="JavaScript" editor={editorPlayerStep?.editor} />
          </div>
          <div
            className={`viewer__task viewer__task--${
              state.done.step.includes(state.current.step) ? "done" : "todo"
            }`}
          >
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
