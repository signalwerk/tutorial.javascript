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

  const { response: steps, loading, hasError } = useFetch<Step[]>(
    `/api/course/js/basic/chapter/${chapter}.json`
  );

  const currentStep = steps?.find((item) => item.id === step);

  const isSolved =
    (state.progress && state.progress[chapter].steps.includes(step)) || false;

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
              <Callout done={isSolved}>
                <div className="viewer__task-text">
                  <h2>
                    {isSolved && <StatusIcon />}
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
              <WorkSpace
                preview={state.current.editor.content}
                focus={state.current.editor.focus}
              >
                <Editor match={currentStep?.tasks[0].match} />
              </WorkSpace>
            </Content>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Viewer;
