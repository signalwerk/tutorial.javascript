import React, { useContext } from "react";
import Window from "../Window";
import WorkSpace from "../WorkSpace";
import Callout from "../Callout";
import StatusIcon from "../StatusIcon";
import Markdown from "../Markdown";
import useFetch from "../../util/useFetch";
import { RouterParams } from "../../index";
import { useParams } from "react-router-dom";

import "./styles.css";
import { Context as SessionContext, Step } from "../../context/session";

import CapterMenu from "../CapterMenu";
import StepMenu from "../StepMenu";
import Player from "../Player";
import Editor from "../Editor";
import Content from "../Content";

function Viewer() {
  const { state, dispatch } = useContext(SessionContext);
  let { chapter, step } = useParams<RouterParams>();

  // const step = chapter?.steps?.find((item) => item.id === state.current.step);
  // const pos = state.current.playPosition;

  // const editorPlayerStepPos =
  //   step?.intro.editor.findIndex((item) => item.time >= pos * 1000) || 0;

  // const editorPlayerStepPos = step
  //   ? findLastIndex(step.intro.editor, (item) => item.time <= pos * 1000)
  //   : 0;

  // const editorPlayerStep = step?.intro.editor[editorPlayerStepPos];

  const { response: steps, loading, hasError } = useFetch<Step[]>(
    `/api/course/js/basic/chapter/${chapter}.json`
  );

  const currentStep = steps?.find((item) => item.id === step);

  return (
    <div className="viewer">
      <div className="viewer__chapter-menu">
        <CapterMenu />
      </div>
      <div className="viewer__content">
        <div className="viewer__step-menu">
          <div className="viewer__step-menu-inner">
            {steps && <StepMenu steps={steps} />}
            {loading && <span>loading...</span>}
            {hasError && <span>Noch kein Inhalt</span>}
          </div>
        </div>
        <div className="viewer__step">
          <div className="viewer__teach">
            <Content className="viewer__teach-inner">
              <Player />
            </Content>
          </div>
          <div className="viewer__task">
            <Content>
              <Callout>
                <div className="viewer__task-text">
                  <h2>
                    {state.done.step.includes(step) && (
                      <StatusIcon />
                    )}
                    Aufgabe
                  </h2>
                  <p>
                    {currentStep && (
                      <Markdown text={currentStep.tasks[0].instruction} />
                    )}
                  </p>
                </div>
              </Callout>
            </Content>
          </div>
          <div className="viewer__learn">
            <Content>
              <WorkSpace preview={state.current.editor.content}>
                <Editor />
              </WorkSpace>
            </Content>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Viewer;
